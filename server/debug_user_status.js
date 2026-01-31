require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin (Copied from server.js)
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'zorphix-26'
        });
    }
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.error('⚠️ Firebase Admin initialization failed:', error.message);
    process.exit(1);
}

const db = admin.firestore();

const emailsToCheck = [
    'saishruthinirmalkumar@gmail.com',
    'ragav3883@gmail.com',
    'kmrudhula820@gmail.com',
    'dhanujajayasankar38@gmail.com',
    'pandimuthaiah2006@gmail.com',
    'sec25ee184@sairamtap.edu.in',
    'lakshanikab@gmail.com',
    'prasanthshanmugam0101@gmail.com',
    '132324.ad@rmkec.ac.in'
];

const uidsToCheck = [
    'rQngzghNRZYQ9j0zFn9Czurt08p2',
    '2pGJqv5EaJa7GcusKy5Tcfyntgl1'
];

async function checkUsers() {
    console.log('🔍 Checking User Status...\n');

    // Check by Email
    for (const email of emailsToCheck) {
        const snapshot = await db.collection('registrations').where('email', '==', email).get();

        if (snapshot.empty) {
            console.log(`❌ ${email}: User NOT FOUND.`);
        } else {
            snapshot.forEach(doc => {
                printUser(doc, email);
            });
        }
    }

    // Check by UID
    console.log('\n--- Checking UIDs ---\n');
    for (const uid of uidsToCheck) {
        const doc = await db.collection('registrations').doc(uid).get();
        if (!doc.exists) {
            console.log(`❌ UID ${uid}: NOT FOUND.`);
        } else {
            printUser(doc, `UID: ${uid}`);
        }
    }
}

function printUser(doc, label) {
    const data = doc.data();
    const events = data.events || [];
    const payments = data.payments || [];

    console.log(`✅ ${label} (Email: ${data.email})`);
    console.log(`   Events: ${events.join(', ') || 'None'}`);
    console.log(`   Payments: ${payments.length} found`);
    payments.forEach((p, i) => {
        console.log(`     ${i + 1}. ${p.paymentId} | Verified: ${p.verified} | Amount: ${p.amount}`);
    });

    const hasPaper = events.some(e => e.includes('Thesis') || e.includes('Paper'));
    console.log(`   Paper Access: ${hasPaper ? 'YES' : 'NO'}`);
    console.log('---');
}

checkUsers().catch(console.error);
