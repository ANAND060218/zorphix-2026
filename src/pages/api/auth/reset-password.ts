import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../../../utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, verificationToken, newPassword } = req.body;

        // Validate inputs
        if (!email || !verificationToken || !newPassword) {
            return res.status(400).json({ message: 'Email, verification token, and new password are required' });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Get stored verification token from Firestore
        const tokenDoc = await adminDb.collection('password_reset_tokens').doc(email).get();

        if (!tokenDoc.exists) {
            return res.status(400).json({ message: 'Invalid or expired verification. Please start over.' });
        }

        const tokenData = tokenDoc.data();

        // Check if token has expired
        if (new Date(tokenData?.expiresAt) < new Date()) {
            await adminDb.collection('password_reset_tokens').doc(email).delete();
            return res.status(400).json({ message: 'Verification has expired. Please start over.' });
        }

        // Verify token
        if (tokenData?.token !== verificationToken) {
            return res.status(400).json({ message: 'Invalid verification token.' });
        }

        // Get user by email
        const user = await adminAuth.getUserByEmail(email);

        // Update password using Firebase Admin SDK
        await adminAuth.updateUser(user.uid, {
            password: newPassword,
        });

        // Delete the used verification token
        await adminDb.collection('password_reset_tokens').doc(email).delete();

        console.log(`Password reset successfully for: ${email}`);
        res.status(200).json({
            message: 'Password reset successfully! You can now login with your new password.',
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({
            message: 'Failed to reset password. Please try again.',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
}
