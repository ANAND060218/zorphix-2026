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
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

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

async function runAutoMerge() {
    console.log('🔄 Starting Auto-Merge for Duplicate Users...');

    const merges = [
        {
            // Kathie Johanna
            badId: 'VNaayc9oh5euguV3INFQlhwYzII2',  // Created by script (with 'I')
            goodId: 'VNaayc9oh5euguV3lNFlQhwYzII2', // Existing correct (with 'l')
            email: 'kathiejohanna.29csa@licet.ac.in'
        },
        {
            // Joavan
            badId: '00vWtYOFUfgFazKuVL4sqp72rVx2', // Created by script (with 'f')
            goodId: '00vWtYOFUtgFazKuVL4sqp72rVx2', // Existing correct (with 't')
            email: 'joavan06@gmail.com'
        }
    ];

    for (const merge of merges) {
        console.log(`Processing merge for ${merge.email}...`);
        try {
            const badRef = db.collection('registrations').doc(merge.badId);
            const goodRef = db.collection('registrations').doc(merge.goodId);

            const [badSnap, goodSnap] = await Promise.all([badRef.get(), goodRef.get()]);

            if (!badSnap.exists) {
                console.log(`ℹ️ Bad ID ${merge.badId} does not exist. Already merged? Skipping.`);
                continue;
            }
            if (!goodSnap.exists) {
                console.log(`⚠️ Good ID ${merge.goodId} does not exist. Cannot merge. Please check IDs.`);
                continue;
            }

            const badData = badSnap.data();
            const eventsToMove = badData.events || [];
            const paymentsToMove = badData.payments || [];

            console.log(`> Found ${eventsToMove.length} events and ${paymentsToMove.length} payments to move.`);

            if (eventsToMove.length > 0 || paymentsToMove.length > 0) {
                // Merge update
                await goodRef.update({
                    events: admin.firestore.FieldValue.arrayUnion(...eventsToMove),
                    payments: admin.firestore.FieldValue.arrayUnion(...paymentsToMove),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`✅ Data merged into ${merge.goodId}`);

                // Delete bad doc
                await badRef.delete();
                console.log(`🗑️ Deleted duplicate document ${merge.badId}`);
            } else {
                console.log(`ℹ️ No data to move for ${merge.email}.`);
            }

        } catch (error) {
            console.error(`❌ Error processing ${merge.email}:`, error);
        }
    }
    console.log('✨ Auto-Merge Process Complete.');
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
            userEmail
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'Missing user ID' });
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

        // SECURITY FIX: Fetch order from Razorpay to get trusted event details
        // This prevents users from paying for cheap events but registering for expensive ones via request tampering
        let eventsToRegister = [];
        try {
            const order = await razorpay.orders.fetch(razorpay_order_id);
            if (order.notes && order.notes.eventNames) {
                // Trusted source: Parse from order notes
                eventsToRegister = order.notes.eventNames.split(',').map(s => s.trim()).filter(Boolean);
                console.log(`🛡️ Using trusted events from Razorpay order: ${JSON.stringify(eventsToRegister)}`);
            } else {
                // Fallback (Should not happen if create-order is working correctly)
                console.warn('⚠️ No event names found in Razorpay order notes. Falling back to request body.');
                if (req.body.eventNames && Array.isArray(req.body.eventNames)) {
                    eventsToRegister = req.body.eventNames;
                }
            }
        } catch (fetchError) {
            console.error('⚠️ Failed to fetch Razorpay order details:', fetchError.message);
            // If we can't fetch the order, we can't verify the items securely. 
            // In production, you might want to fail here. 
            // For now, if provided in body, we proceed but log warning.
            if (req.body.eventNames && Array.isArray(req.body.eventNames)) {
                eventsToRegister = req.body.eventNames;
            } else {
                return res.status(500).json({ error: 'Failed to retrieve event details for verification' });
            }
        }

        if (eventsToRegister.length === 0) {
            return res.status(400).json({ error: 'No events found to register' });
        }

        // Update Firebase if connected
        if (db) {
            try {
                const userRef = db.collection('registrations').doc(userId);
                const docSnap = await userRef.get();

                const paymentRecord = {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    eventNames: eventsToRegister,
                    amount: calculateTotalPrice(eventsToRegister),
                    timestamp: new Date(),
                    verified: true
                };

                if (!docSnap.exists) {
                    // Create new document
                    await userRef.set({
                        events: eventsToRegister,
                        email: userEmail || '',
                        userId: userId,
                        payments: [paymentRecord],
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    // Update existing document
                    const existingEvents = docSnap.data().events || [];
                    const newEvents = [...new Set([...existingEvents, ...eventsToRegister])];

                    await userRef.update({
                        events: newEvents,
                        payments: admin.firestore.FieldValue.arrayUnion(paymentRecord)
                    });
                }

                console.log(`✅ Firebase updated for user: ${userId}`);
            } catch (firebaseError) {
                // RELIABILITY FIX: Do not fail silently
                console.error('❌ Firebase update failed:', firebaseError.message);
                return res.status(500).json({
                    error: 'Payment verified but registration failed',
                    message: 'Database update failed. Please contact support with your Payment ID.',
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id
                });
            }
        } else {
            console.warn('⚠️ Database not connected, skipping registration update');
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Database disconnected. Payment processed but registration pending.',
                paymentId: razorpay_payment_id
            });
        }

        res.json({
            success: true,
            message: 'Payment verified and registered successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            registeredEvents: eventsToRegister
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
            margin: 40
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
        doc.moveDown(1);

        // Subject
        doc.fontSize(11).font('Helvetica-Bold')
            .text('Subject: Request to Grant On Duty (OD) – Participation in ZORPHIX Symposium 2026', { align: 'left' });
        doc.moveDown(1);

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
            'We kindly request you to grant On Duty (OD) permission to the student for attending and participating in the symposium events on the scheduled date. We request students to be present at the venue by 7:50 a.m. The events will begin shortly after the inauguration program, around 9:00 a.m., and will continue until 2:00 p.m. Bus routes will be updated on the Feb 4 in our official instagram page',
            { align: 'justify', lineGap: 5 }
        );
        doc.moveDown(1.5);

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
        doc.moveDown(1);

        doc.text(
            'We appreciate your support in encouraging student participation in technical and innovative events.',
            { align: 'justify', lineGap: 5 }
        );
        doc.moveDown();

        doc.text('Thank you.', { align: 'left' });
        doc.moveDown(1);

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

        let isRegisteredForPaper = false;

        try {
            const userRef = db.collection('registrations').doc(userId);
            const docSnap = await userRef.get();

            if (docSnap.exists) {
                const userData = docSnap.data();
                const userEvents = userData.events || [];
                isRegisteredForPaper = userEvents.some(event =>
                    event === 'Thesis Precised' ||
                    event === 'Paper Presentation' ||
                    event.toLowerCase().includes('thesis') ||
                    event.toLowerCase().includes('paper presentation')
                );
            }
        } catch (dbError) {
            console.warn('⚠️ Database check failed (Auth/Network). Allowing access for debug/fallback:', dbError.message);
            // FAIL OPEN: If DB fails, we assume they might be registered or we just want to unblock them.
            // set to true to allow link generation
            isRegisteredForPaper = true;
        }

        // Only block if we successfully CHECKED and they are NOT registered
        if (!isRegisteredForPaper && db) {
            // If db was null, we skipped the try block, so we shouldn't block here unless we are sure.
            // But valid db client + no registration = block.
            // If db query threw error -> we set isRegisteredForPaper = true above.

            // Re-evaluate strict blocking:
            // If we caught an error, isRegisteredForPaper is true.
            // If we didn't catch error, isRegisteredForPaper is based on logic.

            if (!isRegisteredForPaper) {
                return res.status(403).json({
                    error: 'Not registered for paper presentation',
                    message: 'Please register and pay for Thesis Precised to access the paper upload form.'
                });
            }
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

// Razorpay Webhook Handler (Reliable Background Verification)
app.post('/api/webhook/razorpay', async (req, res) => {
    // Razorpay sends the signature in this header
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
        console.error('❌ Webhook secret not configured');
        return res.status(500).send('Webhook secret missing');
    }

    try {
        // 1. Validate Webhook Signature
        // We must validate that the request actually came from Razorpay
        // We do this by hashing the request body with our secret and comparing it to the signature header
        const crypto = require('crypto');
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            console.error('❌ Invalid webhook signature');
            return res.status(400).send('Invalid signature');
        }

        // 2. Process the Event
        const event = req.body;
        console.log(`🔔 Webhook received: ${event.event}`);

        // We only care about successful payments
        if (event.event === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            const orderEntity = event.payload.order.entity;

            const userId = orderEntity.notes.userId;
            const eventNamesStr = orderEntity.notes.eventNames; // "Event A, Event B"
            const userEmail = orderEntity.notes.userEmail || '';

            // Parse trusted event names from the order we created
            const eventNames = eventNamesStr ? eventNamesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

            console.log(`💰 Payment captured for User: ${userId}, Events: ${eventNames.join(', ')}`);

            if (!userId || eventNames.length === 0) {
                console.error('⚠️ Webhook data missing user or events');
                return res.status(400).send('Invalid data');
            }

            // 3. Update Firebase (Idempotent)
            if (db) {
                const userRef = db.collection('registrations').doc(userId);

                // Transaction ensures we don't process the same payment twice
                await db.runTransaction(async (transaction) => {
                    const doc = await transaction.get(userRef);
                    const userData = doc.exists ? doc.data() : { events: [], payments: [] };

                    const existingPayments = userData.payments || [];

                    // Check if this payment ID was already processed
                    const alreadyProcessed = existingPayments.some(p => p.paymentId === paymentEntity.id);

                    if (alreadyProcessed) {
                        console.log('ℹ️ Payment already processed via Webhook or Frontend');
                        return;
                    }

                    // Create Payment Record
                    const paymentRecord = {
                        orderId: orderEntity.id,
                        paymentId: paymentEntity.id,
                        eventNames: eventNames,
                        amount: orderEntity.amount / 100, // Amount is in paise
                        timestamp: new Date(),
                        method: 'webhook',
                        verified: true
                    };

                    const currentEvents = userData.events || [];
                    const newEvents = [...new Set([...currentEvents, ...eventNames])];

                    if (!doc.exists) {
                        transaction.set(userRef, {
                            events: newEvents,
                            email: userEmail,
                            userId: userId,
                            payments: [paymentRecord],
                            createdAt: admin.firestore.FieldValue.serverTimestamp()
                        });
                    } else {
                        transaction.update(userRef, {
                            events: newEvents,
                            payments: admin.firestore.FieldValue.arrayUnion(paymentRecord)
                        });
                    }
                });

                console.log('✅ Firebase updated successfully via Webhook');

                // Optional: Trigger Welcome Email if it's their first purchase
                // You can add logic here to call the email service if needed
            } else {
                console.error('❌ Database not connected for Webhook');
                return res.status(500).send('Database error');
            }
        }

        // Always return 200 OK to Razorpay so they stop retrying
        res.json({ status: 'ok' });

    } catch (error) {
        console.error('❌ Webhook processing failed:', error);
        // Return 500 so Razorpay retries later (up to 24 hours)
        res.status(500).send('Webhook processing failed');
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
║     Webhook: ${process.env.RAZORPAY_WEBHOOK_SECRET ? '✅ Enabled' : '⚪ Disabled (optional)'}             ║
╚════════════════════════════════════════════════════╝
    `);
});

