import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Check if Razorpay is configured
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'your_razorpay_key_id' || keySecret === 'your_razorpay_secret') {
        // Razorpay not configured - return test mode response for development
        console.log('Razorpay not configured - using test mode');
        return res.status(200).json({
            testMode: true,
            orderId: `test_order_${Date.now()}`,
            amount: req.body.amount * 100,
            currency: 'INR',
            message: 'Razorpay not configured - using test mode',
        });
    }

    try {
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const { amount, eventId, eventName, userId, userEmail } = req.body;

        if (!amount || !eventId || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `event_${eventId}_${userId}_${Date.now()}`,
            notes: {
                eventId,
                eventName,
                userId,
                userEmail,
            },
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create order', error: String(error) });
    }
}
