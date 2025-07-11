const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const dynamo = require('../service/dynamodbmanager');

const router = express.Router();
const PAYROLL_TABLE = 'Payroll';
const db = new dynamo();

router.get('/sync', async (req, res) => {
  try {
    const workbook = XLSX.readFile(path.join(__dirname, '../June WH Salary Data.xlsx'));
    console.log('📄 Sheet Names:', workbook.SheetNames);

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['WH Consol Register'], {
      range: 2,
      defval: '',
    });

    if (!sheet || sheet.length === 0) {
      console.warn('⚠️ Sheet is empty or not parsed properly.');
      return res.status(400).json({ error: 'Empty sheet or parsing error' });
    }

    const allHeaders = Object.keys(sheet[0]);
    const payrollItems = [];

    let skipped = 0;
    let accepted = 0;

    const financialTimeline = "June 2025"; // 📌 Add this constant or make it dynamic if needed

    sheet.forEach((row, rowIndex) => {
      const mobile = row['Mobile'];

      if (!mobile || isNaN(mobile)) {
        skipped++;
        console.log(`⛔ Skipping row ${rowIndex + 2}: Invalid mobile ->`, mobile);
        return;
      }

      const item = {
        Mobile: mobile.toString(),
        FinancialTimeline: financialTimeline, // ✅ Add this for querying purposes
      };

      allHeaders.forEach((key, idx) => {
        if (idx >= 15 && idx <= 30) return;
        if (key === 'Mobile') return;

        const value = row[key];
        item[key.replace(/\s+/g, '_')] = typeof value === 'string' ? value.trim() : value;
      });

      payrollItems.push(item);
      accepted++;
    });

    console.log(`✅ Accepted: ${accepted}, ⛔ Skipped: ${skipped}`);

    // ✅ Batch write with deduplication
    const BATCH_SIZE = 25;
    let totalInserted = 0;

    for (let i = 0; i < payrollItems.length; i += BATCH_SIZE) {
      const batchSlice = payrollItems.slice(i, i + BATCH_SIZE);

      const seenMobiles = new Set();
      const dedupedBatch = [];

      for (const item of batchSlice) {
        const uniqueKey = `${item.Mobile}#${item.FinancialTimeline}`;
        if (!seenMobiles.has(uniqueKey)) {
          seenMobiles.add(uniqueKey);
          dedupedBatch.push({ PutRequest: { Item: item } });
        } else {
          console.warn(`⚠️ Duplicate Mobile+Timeline in batch -> ${uniqueKey}, skipping`);
        }
      }

      const params = {
        RequestItems: {
          [PAYROLL_TABLE]: dedupedBatch,
        },
      };

      if (dedupedBatch.length > 0) {
        await db.batchWrite(params);
        totalInserted += dedupedBatch.length;
        console.log(`📦 Inserted batch ${i / BATCH_SIZE + 1}: ${dedupedBatch.length} items`);
      } else {
        console.log(`⚠️ Batch ${i / BATCH_SIZE + 1} had only duplicates — skipped`);
      }
    }

    res.json({ message: `✅ Uploaded ${totalInserted} payroll entries. Skipped: ${skipped}` });
  } catch (error) {
    console.error('❌ Error processing payroll:', error);
    res.status(500).json({ error: 'Failed to process payroll sheet' });
  }
});

module.exports = router;
