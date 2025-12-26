import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailTemplate } from '../../../../utils/emailTemplate';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        name,
        email,
        uid,
        department,
        year,
        contactNo,
        collegeName,
        degree,
      } = req.body;

      // Combine all fields into an object for the QR code
      const qrData = {
        uid,
        name,
        email,
        department,
        year,
        contactNo,
        collegeName,
        degree,
      };

      // Generate QR code as base64
      const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrData));

      // Extract pure base64 (remove "data:image/png;base64," prefix)
      const base64Image = qrCodeBase64.split(',')[1];

      // Send the email with the QR code as base64 attachment
      await transporter.sendMail({
        to: email,
        subject: "Welcome to Zorphix 2024!",
        html: getEmailTemplate(name),
        attachments: [
          {
            filename: `${uid}.png`,
            content: base64Image,
            encoding: 'base64',
          },
        ],
      });

      console.log("Email sent successfully to:", email);
      res.status(200).json({ message: 'Email sent successfully', qrCodeBase64 });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: 'Failed to send email', error: String(error) });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

