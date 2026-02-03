const admin = require('firebase-admin');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Path to your Excel file
const EXCEL_FILE_PATH = process.argv[2];

// Initialize Firebase with local service account
const serviceAccountPath = path.join(__dirname, '../zorphix-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateLegacyData(filePath) {
    if (!filePath || !fs.existsSync(filePath)) {
        console.error('❌ Excel file not found. Usage: node scripts/migrate_legacy.js <file.xlsx>');
        process.exit(1);
    }

    console.log(`📂 Reading Excel: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log(`📊 Found ${rows.length} records. Uploading to 'legacy_imports'...`);

    let count = 0;
    const batchSize = 500;
    let batch = db.batch();

    for (const row of rows) {
        // Normalize Email
        const emailRaw = row['email'] || row['Email'] || row['EMAIL'];
        if (!emailRaw) continue; // Skip rows without email
        const email = emailRaw.trim().toLowerCase();

        // Extract Data
        const eventsRaw = row['events'] || row['Events'] || '';
        const events = Array.isArray(eventsRaw) ? eventsRaw : eventsRaw.split(',').map(s => s.trim()).filter(Boolean);

        const paymentId = row['paymentId'] || row['Payment ID'] || row['payment_id'];

        let payments = [];
        if (paymentId) {
            payments.push({
                paymentId: String(paymentId),
                amount: row['amount'] || 120,
                verified: true,
                timestamp: new Date(),
                method: 'legacy_import'
            });
        }

        const userData = {
            email: email,
            displayName: row['name'] || row['Name'] || '',
            phone: row['phone'] || row['Phone'] || '',
            college: row['college'] || row['College'] || '',
            department: row['department'] || row['Department'] || '',
            year: row['year'] || row['Year'] || '',
            events: events,
            payments: payments,
            legacyImport: true
        };

        // Add to batch - Keyed by EMAIL
        const docRef = db.collection('legacy_imports').doc(email);
        batch.set(docRef, userData);

        count++;
        if (count % batchSize === 0) {
            await batch.commit();
            console.log(`✅ Committed batch of ${batchSize} records...`);
            batch = db.batch();
        }
    }

    // Commit remaining
    await batch.commit();
    console.log(`\n✨ Done! Uploaded ${count} legacy records.`);
}

migrateLegacyData(EXCEL_FILE_PATH);
