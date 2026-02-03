const admin = require('firebase-admin');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin (reuse logic from server.js roughly or just load the file)
const serviceAccountPath = path.join(__dirname, '../zorphix-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData(excelFilePath) {
    console.log(`📂 Reading Excel file: ${excelFilePath}`);

    if (!fs.existsSync(excelFilePath)) {
        console.error('❌ File not found!');
        return;
    }

    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`📊 Found ${data.length} records. Starting migration...`);

    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
        try {
            // Map Excel columns to Firestore fields
            // Adjust these mapping based on your actual Excel columns
            // Assuming columns like: Name, Email, Phone, College, Department, Year, Events (comma separated), etc.

            const email = row['Email'] || row['email'];
            if (!email) {
                console.warn('⚠️ Row missing email, skipping:', row);
                continue;
            }

            // Generate or find User ID. 
            // Ideally getting the original UID is best, but if not available, we use email as key or generate new.
            // Since this is migration, we check if we have an ID column
            let userId = row['User ID'] || row['userId'] || row['id'];

            if (!userId) {
                // If no User ID in excel, check if user exists in Auth (hard without auth export)
                // For now, let's assume we might need to recreate them or use email hash/sanitized email
                // userId = email.replace(/[@.]/g, '_'); 
                // BETTER: If this is fresh data, we might want to let them sign in again? 
                // But if we want to preserve payments, we need a stable ID. 
                // If you have the original export with UIDs, use that.
                // If not, we might create a document with the EMAIL as the ID temporarily or search by email.
                // Let's use the email as a query to see if it exists, if not create new.
                // For bulk import, just using email as ID is risky if they sign in with Google which gives a random UID.
                // STRATEGY: Create a document where ID = UID if known.
            }

            // Logic to construct the user object
            const eventString = row['Events'] || row['events'] || '';
            const events = eventString ? eventString.split(',').map(e => e.trim()) : [];

            // Payments?
            // If the excel has payment info, add it.
            const paymentId = row['Payment ID'] || row['payment_id'];
            const amount = row['Amount'] || row['amount'];

            const payments = [];
            if (paymentId) {
                payments.push({
                    paymentId: String(paymentId),
                    amount: Number(amount) || 0,
                    verified: true,
                    timestamp: new Date(), // We might lose original timestamp if not in excel
                    eventNames: events
                });
            }

            const userData = {
                displayName: row['Name'] || row['name'] || '',
                email: email,
                phone: row['Phone'] || row['phone'] || '',
                college: row['College'] || row['college'] || '',
                department: row['Department'] || row['department'] || '',
                year: row['Year'] || row['year'] || '',
                events: events,
                payments: payments,
                migratedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            // If we have a specific UID column, use it
            if (userId) {
                await db.collection('registrations').doc(userId).set(userData, { merge: true });
                // console.log(`✅ ${email} migrated (UID: ${userId})`);
            } else {
                // If we don't have UID, we can't easily sync with Firebase Auth UIDs.
                // We might need to handle this.
                // OPTION: Create a doc with email as ID or random ID.
                // Best for now: Add to 'registrations_backup' or try to match email?
                // CAUTION: If user signs in with Google, they get a UID. 
                // If we put data under a different ID, they won't see it.
                // Ideally, we need the export from Firebase Authentication to map Emails -> UIDs.
                console.log(`⚠️ No UID for ${email}, using email as ID for Reference.`);
                await db.collection('registrations').doc(email).set(userData, { merge: true });
            }

            successCount++;
            if (successCount % 50 === 0) console.log(`...processed ${successCount} records`);

        } catch (error) {
            console.error(`❌ Error migrating ${row['Email']}:`, error.message);
            errorCount++;
        }
    }

    console.log(`\n✨ Migration Complete.`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
}

// Get file from command line arg
const excelFile = process.argv[2];
if (!excelFile) {
    console.log('Usage: node scripts/migrate_excel.js <path-to-excel-file>');
} else {
    migrateData(excelFile);
}
