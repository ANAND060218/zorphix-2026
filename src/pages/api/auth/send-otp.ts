import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../../../utils/firebaseAdmin';
import { getOtpEmailTemplate } from '../../../../utils/otpEmail';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Generate 6-digit OTP
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Check if user exists in Firebase Auth
        let user;
        try {
            user = await adminAuth.getUserByEmail(email);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string };
            if (firebaseError.code === 'auth/user-not-found') {
                return res.status(404).json({ message: 'No account found with this email address' });
            }
            throw error;
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Store OTP in Firestore
        await adminDb.collection('password_reset_otps').doc(email).set({
            otp,
            expiresAt: expiresAt.toISOString(),
            attempts: 0,
            createdAt: new Date().toISOString(),
        });

        // Get user's display name for personalized email
        const userName = user.displayName || user.email?.split('@')[0] || 'User';

        // Send OTP via email
        await transporter.sendMail({
            to: email,
            subject: "Password Reset OTP - Zorphix",
            html: getOtpEmailTemplate(userName, otp),
        });

        console.log(`OTP sent successfully to: ${email}`);
        res.status(200).json({
            message: 'OTP sent successfully! Please check your email.',
            email: email
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({
            message: 'Failed to send OTP. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
}
