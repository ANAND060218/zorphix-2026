require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const admin = require('firebase-admin');
const { calculateTotalPrice, getEventByName } = require('./events');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
    credentials: true
}));
app.use(express.json());

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
        console.log(order);

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
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
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

// Email Transporter Configuration
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
    console.warn("⚠️ WARNING: Email credentials missing in .env file. Email features will fail.");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// Send QR Email (Welcome or Update)
app.post('/api/send-welcome-email', async (req, res) => {
    try {
        const { userDetails, type = 'welcome' } = req.body;

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

        // Generate QR Code Buffer
        const qrBuffer = await QRCode.toBuffer(qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Dynamic Email Content
        const isUpdate = type === 'update';
        const subject = isUpdate ? 'Zorphix 2026 - Profile Updated' : 'Welcome to Zorphix 2026 - Registration Successful!';
        const headerText = isUpdate ? 'PROFILE UPDATED' : 'WELCOME TO THE GRID';
        const introText = isUpdate
            ? `Greetings ${userDetails.name},<br>Your profile details have been successfully updated. Here is your updated generic entry pass.`
            : `Greetings ${userDetails.name},<br>Your profile has been successfully registered for Zorphix 2026. Attached is your generic entry pass (QR Code). Keep this safe!`;

        const mailOptions = {
            from: `"Zorphix 2026 Support" <${process.env.EMAIL_USER}>`,
            to: userDetails.email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px;">
                    <h1 style="color: #e33e33; text-align: center;">${headerText}</h1>
                    <p>${introText}</p>

                    <div style="background-color: #111; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #97b85d; margin-top: 0;">CURRENT PROFILE DETAILS</h3>
                        <p><strong>ID:</strong> ${userDetails.uid}</p>
                        <p><strong>College:</strong> ${userDetails.college}</p>
                        <p><strong>Department:</strong> ${userDetails.department}</p>
                    </div>

                    <p style="color: #888; font-size: 12px; text-align: center;">This QR code contains your updated identity data. Present it at the venue for scanning.</p>
                </div>
            `,
            attachments: [
                {
                    filename: `zorphix-pass-${userDetails.uid.slice(0, 6)}.png`,
                    content: qrBuffer,
                    contentType: 'image/png'
                }
            ]
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        console.log(`✅ ${isUpdate ? 'Update' : 'Welcome'} email sent to: ${userDetails.email}`);

        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('❌ Email sending failed:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
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
╚════════════════════════════════════════════════════╝
    `);
});
