require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const axios = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const admin = require('firebase-admin');
const { calculateTotalPrice, getEventByName, getPaperUploadLink } = require('./events');
const { Resend } = require('resend');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Proxy for Render (Required for Rate Limiting to work behind proxy)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL, /\.vercel\.app$/].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Keep-Alive Mechanism for Render Free Tier
// Pings the server every 14 minutes to prevent sleeping (Render sleeps after 15 mins of inactivity)
cron.schedule('*/14 * * * *', async () => {
    try {
        const healthUrl = `http://localhost:${PORT}/api/health`;
        await axios.get(healthUrl);
        console.log('🔄 Self-ping successful (Keep-Alive)');
    } catch (error) {
        console.error('⚠️ Self-ping failed:', error.message);
    }
});

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Initialize Firebase Admin (using service account or default credentials)
let db = null;
try {
    // Try to initialize with service account if provided
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Initialize with project ID only (requires GOOGLE_APPLICATION_CREDENTIALS env var)
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'zorphix-26'
        });
    }
    db = admin.firestore();
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.error('⚠️ Firebase Admin initialization failed:', error.message);
    console.log('⚠️ Firebase operations will be skipped. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        firebase: db ? 'connected' : 'not connected'
    });
});

// Legacy endpoint for backward compatibility
app.post('/create-order', async (req, res) => {
    // Redirect to new endpoint
    return handleCreateOrder(req, res);
});

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
    return handleCreateOrder(req, res);
});

async function handleCreateOrder(req, res) {
    try {
        const { userId, eventNames, userEmail } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }


        if (!eventNames || !Array.isArray(eventNames) || eventNames.length === 0) {
            return res.status(400).json({ error: 'Event names array is required' });
        }

        // Calculate total from backend data (prevents price tampering)
        const totalAmount = calculateTotalPrice(eventNames);

        if (totalAmount === 0) {
            return res.status(400).json({ error: 'No payable events found. All events may be free.' });
        }

        // Convert to paise (Razorpay uses smallest currency unit)
        const amountInPaise = totalAmount * 100;

        // Create Razorpay order
        // Receipt must be max 40 chars: "zrp_" (4) + shortId (8) + "_" (1) + timestamp (13) = 26 chars
        const shortUserId = userId.slice(-8);
        const orderOptions = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `zrp_${shortUserId}_${Date.now()}`,
            notes: {
                userId: userId,
                userEmail: userEmail || '',
                eventNames: eventNames.join(', ')
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        console.log(`✅ Order created: ${order.id} for ₹${totalAmount} (${eventNames.length} events)`);

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            eventNames: eventNames,
            totalAmount: totalAmount
        });

    } catch (error) {
        console.error('❌ Order creation failed:', error);
        res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
}

// Verify Payment and Update Firebase
app.post('/api/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            eventNames,
            userEmail
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        if (!userId || !eventNames || !Array.isArray(eventNames)) {
            return res.status(400).json({ error: 'Missing user or event details' });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValidSignature = expectedSignature === razorpay_signature;

        if (!isValidSignature) {
            console.error('❌ Invalid signature for payment:', razorpay_payment_id);
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        console.log(`✅ Payment verified: ${razorpay_payment_id}`);

        // Update Firebase if connected
        if (db) {
            try {
                const userRef = db.collection('registrations').doc(userId);
                const docSnap = await userRef.get();

                const paymentRecord = {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    eventNames: eventNames,
                    amount: calculateTotalPrice(eventNames),
                    timestamp: new Date(), // Fixed: serverTimestamp() cannot be used inside arrays
                    verified: true
                };

                if (!docSnap.exists) {
                    // Create new document
                    await userRef.set({
                        events: eventNames,
                        email: userEmail || '',
                        userId: userId,
                        payments: [paymentRecord],
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    // Update existing document
                    const existingEvents = docSnap.data().events || [];
                    const newEvents = [...new Set([...existingEvents, ...eventNames])];

                    await userRef.update({
                        events: newEvents,
                        payments: admin.firestore.FieldValue.arrayUnion(paymentRecord)
                    });
                }

                console.log(`✅ Firebase updated for user: ${userId}`);
            } catch (firebaseError) {
                console.error('⚠️ Firebase update failed:', firebaseError.message);
                // Still return success since payment is verified
                // The frontend can retry Firebase update
            }
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            registeredEvents: eventNames
        });

    } catch (error) {
        console.error('❌ Payment verification failed:', error);
        res.status(500).json({
            error: 'Payment verification failed',
            message: error.message
        });
    }
});

// Get payment status
app.get('/api/payment-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await razorpay.orders.fetch(orderId);

        res.json({
            orderId: order.id,
            status: order.status,
            amount: order.amount / 100,
            currency: order.currency,
            createdAt: order.created_at
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
});

// Send Welcome Email (Only for initial account creation)
app.post('/api/send-welcome-email', async (req, res) => {
    console.log('📧 Welcome email endpoint called');
    try {
        const { userDetails } = req.body;

        if (!userDetails || !userDetails.email) {
            return res.status(400).json({ error: 'User details with email are required' });
        }

        // Generate QR Data
        const qrData = JSON.stringify({
            uid: userDetails.uid,
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            college: userDetails.college,
            dept: userDetails.department,
            year: userDetails.year,
            events: userDetails.events || []
        });

        // Generate QR Code as base64 data URL
        const qrDataUrl = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Convert base64 data URL to buffer for attachment
        const qrBase64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');

        // Generate OD Letter PDF
        const odPdfBuffer = await generateODLetterPDF(userDetails);
        const odBase64Data = odPdfBuffer.toString('base64');

        // Send email using Resend with QR and OD Letter as attachments
        const { data, error } = await resend.emails.send({
            from: 'Zorphix 2026 <noreply@zorphix.com>',
            to: userDetails.email,
            subject: 'Welcome to Zorphix 2026 - Registration Successful!',
            attachments: [
                {
                    filename: 'zorphix-qr-code.png',
                    content: qrBase64Data,
                },
                {
                    filename: `OD_Letter_${(userDetails.name || 'Student').replace(/\s+/g, '_')}.pdf`,
                    content: odBase64Data,
                }
            ],
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px;">
                    <h1 style="color: #e33e33; text-align: center;">WELCOME TO THE GRID</h1>
                    <p>Greetings ${userDetails.name},<br>Your profile has been successfully registered for Zorphix 2026. Your entry pass QR Code is attached to this email. Keep this safe!</p>

                    <div style="background-color: #111; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #97b85d; margin-top: 0;">YOUR PROFILE DETAILS</h3>
                        <p><strong>Name:</strong> ${userDetails.name}</p>
                        <p><strong>College:</strong> ${userDetails.college}</p>
                        <p><strong>Department:</strong> ${userDetails.department}</p>
                    </div>

                    <div style="text-align: center; margin: 20px 0; padding: 20px; background-color: #1a1a1a; border-radius: 10px; border: 2px solid #e33e33;">
                        <p style="color: #e33e33; font-size: 18px; font-weight: bold; margin: 0;">📎 QR CODE ATTACHED</p>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">Please download the attached QR code image (zorphix-qr-code.png)</p>
                    </div>

                    <div style="text-align: center; margin: 20px 0; padding: 20px; background-color: #1a1a1a; border-radius: 10px; border: 2px solid #97b85d;">
                        <p style="color: #97b85d; font-size: 18px; font-weight: bold; margin: 0;">📄 OD LETTER ATTACHED</p>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">We have attached an On-Duty (OD) letter for your convenience.</p>
                        <p style="color: #fff; font-size: 14px; margin-top: 10px;"><strong>Submit this letter to your college Principal/HOD to get permission for attending ZORPHIX Symposium 2026 on 05/02/2026.</strong></p>
                    </div>

                    <div style="text-align: center; margin: 20px 0; padding: 25px; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-radius: 10px; border: 2px dashed #ffa500;">
                        <p style="color: #ffa500; font-size: 20px; font-weight: bold; margin: 0;">🚀 REGISTER FOR EVENTS!</p>
                        <p style="color: #fff; font-size: 14px; margin-top: 15px; line-height: 1.6;">Your profile is ready, but don't stop here! Explore and register for our exciting <strong style="color: #e33e33;">Technical Events</strong>, <strong style="color: #97b85d;">Workshops</strong>, and <strong style="color: #ffa500;">Thesis Precised</strong> to make the most of Zorphix 2026!</p>
                        <a href="https://www.zorphix.com/events" style="display: inline-block; margin-top: 20px; padding: 15px 40px; background: linear-gradient(135deg, #e33e33 0%, #ff6b6b 100%); color: #fff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 5px; text-transform: uppercase; letter-spacing: 2px;">Browse Events →</a>
                        <p style="color: #888; font-size: 12px; margin-top: 15px;">Visit: <a href="https://www.zorphix.com/events" style="color: #e33e33;">www.zorphix.com/events</a></p>
                    </div>

                    <p style="color: #888; font-size: 12px; text-align: center;">This QR code contains your identity data. Present it at the venue for scanning.</p>
                </div>
            `
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email', details: error.message });
        }

        console.log(`✅ Welcome email with OD Letter sent to: ${userDetails.email}`);
        res.json({ success: true, message: 'Email sent successfully', id: data.id });

    } catch (error) {
        console.error('❌ Email sending failed:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Helper function to generate OD Letter PDF buffer
async function generateODLetterPDF(userDetails) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // PDF Content - Exact template as specified
        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Header - To Address
        doc.fontSize(11).font('Helvetica-Bold')
            .text('To,', { align: 'left' });
        doc.font('Helvetica')
            .text('The Principal / Head of Department,', { align: 'left' })
            .text(`${userDetails.college || '[Student College Name]'},`, { align: 'left' })
            .text(currentDate, { align: 'left' });
        doc.moveDown(2);

        // Subject
        doc.fontSize(11).font('Helvetica-Bold')
            .text('Subject: Request to Grant On Duty (OD) – Participation in ZORPHIX Symposium 2026', { align: 'left' });
        doc.moveDown(2);

        // Body
        doc.fontSize(11).font('Helvetica')
            .text('Respected Sir/Madam,', { align: 'left' });
        doc.moveDown();

        doc.text(
            'Greetings from the Department of Computer Science and Business Systems (CSBS) at the Chennai Institute of Technology.',
            { align: 'justify', lineGap: 5 }
        );
        doc.moveDown();

        // Paragraph with highlighted symposium name and date
        doc.font('Helvetica')
            .text('This is to inform you that the following student from your esteemed institution has registered to participate in ', { continued: true, align: 'justify', lineGap: 5 })
            .font('Helvetica-Bold')
            .text('"ZORPHIX Symposium – 2026"', { continued: true })
            .font('Helvetica')
            .text(', organized by our department, on ', { continued: true })
            .font('Helvetica-Bold')
            .text('05/02/2026', { continued: true })
            .font('Helvetica')
            .text('.');
        doc.moveDown();

        doc.text(
            'We kindly request you to grant On Duty (OD) permission to the student for attending and participating in the symposium events on the scheduled date.',
            { align: 'justify', lineGap: 5 }
        );
        doc.moveDown(2);

        // Student Details Section
        doc.fontSize(12).font('Helvetica-Bold')
            .text('Student Details', { align: 'left', underline: true });
        doc.moveDown();

        doc.fontSize(11).font('Helvetica')
            .text(`Name of the Student: ${userDetails.name || '______________________________'}`, { align: 'left' });
        doc.moveDown(0.5);
        const deptYear = userDetails.department && userDetails.year
            ? `${userDetails.department} / ${userDetails.year}`
            : userDetails.department || userDetails.year || '________________________________';
        doc.text(`Department / Year: ${deptYear}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`College Name: ${userDetails.college || '_____________________________________'}`, { align: 'left' });
        doc.moveDown(2);

        doc.text(
            'We appreciate your support in encouraging student participation in technical and innovative events.',
            { align: 'justify', lineGap: 5 }
        );
        doc.moveDown();

        doc.text('Thank you.', { align: 'left' });
        doc.moveDown(2);

        // First Signature Section - HOD
        doc.fontSize(11).font('Helvetica')
            .text('Yours faithfully,', { align: 'left' });
        doc.moveDown();

        // Add HOD signature image if exists (auto-scaled)
        const hodSignaturePath = path.join(__dirname, 'assets', 'signature_hod.png');
        if (fs.existsSync(hodSignaturePath)) {
            try {
                doc.image(hodSignaturePath, {
                    fit: [150, 60],
                    align: 'left'
                });
            } catch (imgErr) {
                console.warn('Could not load HOD signature image:', imgErr.message);
            }
        }
        doc.moveDown();

        doc.fontSize(11).font('Helvetica-Bold')
            .text('Mr. G Senthil Kumar', { align: 'left' });
        doc.font('Helvetica')
            .text('Head of the Department (CSBS)', { align: 'left' })
            .text('Chennai Institute of Technology', { align: 'left' });
        doc.moveDown(2);

        // Second Signature Section - President
        // Add President signature image if exists (auto-scaled)
        const presidentSignaturePath = path.join(__dirname, 'assets', 'signature_president.png');
        if (fs.existsSync(presidentSignaturePath)) {
            try {
                doc.image(presidentSignaturePath, {
                    fit: [150, 60],
                    align: 'left'
                });
            } catch (imgErr) {
                console.warn('Could not load President signature image:', imgErr.message);
            }
        }
        doc.moveDown();

        doc.fontSize(11).font('Helvetica-Bold')
            .text('Dhaneesh Bala', { align: 'left' });
        doc.font('Helvetica')
            .text('President – Zorphix 2026', { align: 'left' });

        doc.end();
    });
}

// Download OD Letter PDF directly
app.post('/api/download-od-letter', async (req, res) => {
    console.log('📄 OD Letter download endpoint called');
    try {
        const { userDetails } = req.body;

        if (!userDetails) {
            return res.status(400).json({ error: 'User details are required' });
        }

        // Generate PDF using shared function
        const pdfBuffer = await generateODLetterPDF(userDetails);

        // Set headers for PDF download
        const fileName = `OD_Letter_${(userDetails.name || 'Student').replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        console.log(`✅ OD Letter generated for: ${userDetails.name}`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('❌ OD Letter generation failed:', error);
        res.status(500).json({ error: 'Failed to generate OD letter', details: error.message });
    }
});

// Get Paper Upload Link (Only for registered users)
app.post('/api/get-paper-upload-link', async (req, res) => {
    console.log('📄 Paper upload link request received');
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if user is registered for paper presentation
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const userRef = db.collection('registrations').doc(userId);
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            return res.status(403).json({
                error: 'Not registered',
                message: 'You need to register for Thesis Precised first to access the paper upload form.'
            });
        }

        const userData = docSnap.data();
        const userEvents = userData.events || [];

        // Check if user is registered for "Thesis Precised" (paper presentation)
        const isRegisteredForPaper = userEvents.some(event =>
            event === 'Thesis Precised' ||
            event === 'Paper Presentation' ||
            event.toLowerCase().includes('thesis') ||
            event.toLowerCase().includes('paper presentation')
        );

        if (!isRegisteredForPaper) {
            return res.status(403).json({
                error: 'Not registered for paper presentation',
                message: 'Please register and pay for Thesis Precised to access the paper upload form.'
            });
        }

        // User is registered, return the link
        const uploadLink = getPaperUploadLink();

        if (!uploadLink) {
            return res.status(500).json({ error: 'Paper upload link not configured' });
        }

        console.log(`✅ Paper upload link provided to user: ${userId}`);
        res.json({
            success: true,
            paperUploadLink: uploadLink
        });

    } catch (error) {
        console.error('❌ Error fetching paper upload link:', error);
        res.status(500).json({ error: 'Failed to fetch paper upload link', details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║     🚀 Zorphix Payment Server Running!             ║
║                                                    ║
║     Port: ${PORT}                                     ║
║     Health: http://localhost:${PORT}/api/health       ║
║                                                    ║
║     Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing Key'}              ║
║     Firebase: ${db ? '✅ Connected' : '⚠️ Not Connected'}                ║
║     Email: ✅ Resend Configured                    ║
╚════════════════════════════════════════════════════╝
    `);
});
