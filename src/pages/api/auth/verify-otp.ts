import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../../utils/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, otp } = req.body;

        // Validate inputs
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Get stored OTP from Firestore
        const otpDoc = await adminDb.collection('password_reset_otps').doc(email).get();

        if (!otpDoc.exists) {
            return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
        }

        const otpData = otpDoc.data();

        // Check if OTP has expired
        if (new Date(otpData?.expiresAt) < new Date()) {
            // Delete expired OTP
            await adminDb.collection('password_reset_otps').doc(email).delete();
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Check attempts (max 5 attempts)
        if (otpData?.attempts >= 5) {
            await adminDb.collection('password_reset_otps').doc(email).delete();
            return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
        }

        // Verify OTP
        if (otpData?.otp !== otp) {
            // Increment attempts
            await adminDb.collection('password_reset_otps').doc(email).update({
                attempts: (otpData?.attempts || 0) + 1
            });
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // OTP is valid - generate verification token
        const verificationToken = uuidv4();
        const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store verification token and delete OTP
        await adminDb.collection('password_reset_tokens').doc(email).set({
            token: verificationToken,
            expiresAt: tokenExpiresAt.toISOString(),
            createdAt: new Date().toISOString(),
        });

        // Delete the used OTP
        await adminDb.collection('password_reset_otps').doc(email).delete();

        console.log(`OTP verified successfully for: ${email}`);
        res.status(200).json({
            message: 'OTP verified successfully!',
            verificationToken,
            email
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({
            message: 'Failed to verify OTP. Please try again.',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
}
