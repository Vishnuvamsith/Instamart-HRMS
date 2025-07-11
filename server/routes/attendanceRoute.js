// const express = require('express');
// const XLSX = require('xlsx');
// const path = require('path');
// const dynamo = require('../service/dynamodbmanager');
// const router = express.Router();
// const ATTENDANCE_TABLE = 'Attendance';
// const db = new dynamo();
// router.get('/sync', async (req, res) => {
//   try {
//     const workbook = XLSX.readFile(path.join(__dirname, '../June WH Salary Data.xlsx'));
//     const sheet = XLSX.utils.sheet_to_json(
//       workbook.Sheets['WH Consol Input'],
//       {
//         range: 1
//       }
//     );

//     const allItems = [];

//     sheet.forEach((row) => {
//       const mobile = row['Mobile']?.toString();
//       if (!mobile) return;

//       Object.keys(row).forEach((key) => {
//         if (isDateColumn(key)) {
//           const [day, mon, yr] = key.split('-');
//           const isoDate = `20${yr}-${monthToNum(mon)}-${pad(day)}`;
//           const status = row[key]?.trim() || 'A';

//           allItems.push({
//             Mobile: mobile,
//             Date: isoDate,
//             Status: status,
//             Name: row['Name'] || '',
//             WH: row['WH Name'] || '',
//             City: row['City'] || '',
//             State: row['State'] || '',
//             Designation: row['Designation'] || '',
//             Department: row['Department'] || '',
//             Vendor: row['Vendor'] || '',
//             DOJ: row['DOJ (DD-MMM-YY)'] || '',
//             Manager: row['Manager Name'] || '',
//           });
//         }
//       });
//     });

//     // ✅ Global deduplication
//     const globalMap = new Map();
//     for (const item of allItems) {
//       const key = `${item.Mobile}#${item.Date}`;
//       if (!globalMap.has(key)) {
//         globalMap.set(key, item);
//       } else {
//         console.warn(`⚠️ Global duplicate for ${key} — keeping first.`);
//       }
//     }

//     const uniqueItems = Array.from(globalMap.values());

//     // ✅ Batch write with batch-level deduplication
//     const BATCH_SIZE = 25;
//     for (let i = 0; i < uniqueItems.length; i += BATCH_SIZE) {
//       const slice = uniqueItems.slice(i, i + BATCH_SIZE);

//       // Batch-level dedup
//       const batchMap = new Map();
//       for (const item of slice) {
//         const key = `${item.Mobile}#${item.Date}`;
//         if (!batchMap.has(key)) {
//           batchMap.set(key, item);
//         } else {
//           console.warn(`⚠️ Duplicate inside batch for key ${key}, skipping`);
//         }
//       }

//       const batch = Array.from(batchMap.values()).map(item => ({
//         PutRequest: { Item: item }
//       }));

//       if (batch.length === 0) continue; // skip empty

//       const params = {
//         RequestItems: {
//           [ATTENDANCE_TABLE]: batch,
//         },
//       };

//       await db.batchWrite(params);
//     }

//     res.json({ message: `✅ Uploaded ${uniqueItems.length} unique attendance entries.` });
//   } catch (error) {
//     console.error('❌ Error processing attendance:', error);
//     res.status(500).json({ error: 'Failed to process attendance sheet' });
//   }
// });
// module.exports = router;


// function pad(n) {
//   return n.length === 1 ? '0' + n : n;
// }

// function monthToNum(mon) {
//   return {
//     Jan: '01', Feb: '02', Mar: '03', Apr: '04',
//     May: '05', Jun: '06', Jul: '07', Aug: '08',
//     Sep: '09', Oct: '10', Nov: '11', Dec: '12',
//   }[mon] || '00';
// }

// function isDateColumn(colName) {
//   return /^\d{1,2}-[A-Za-z]{3}-\d{2}$/.test(colName);
// }


// const express = require('express');
// const XLSX = require('xlsx');
// const path = require('path');
// const { PutCommand } = require('@aws-sdk/lib-dynamodb');
// const dynamo = require('../service/dynamodbmanager');
// const router = express.Router();
// const ATTENDANCE_TABLE = 'Attendance';
// const db = new dynamo();

// router.get('/sync', async (req, res) => {
//   try {
//     const workbook = XLSX.readFile(path.join(__dirname, '../June WH Salary Data.xlsx'));
//     const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['WH Consol Input'], { range: 1 });

//     const attendanceMap = new Map();

//     for (const row of sheet) {
//       const mobile = row['Mobile']?.toString().trim();
//       if (!mobile) continue;

//       if (!attendanceMap.has(mobile)) {
//         attendanceMap.set(mobile, {
//           Mobile: mobile,
//           Name: row['Name'] || '',
//           WH: row['WH Name'] || '',
//           City: row['City'] || '',
//           State: row['State'] || '',
//           Designation: row['Designation'] || '',
//           Department: row['Department'] || '',
//           Vendor: row['Vendor'] || '',
//           DOJ: row['DOJ (DD-MMM-YY)'] || '',
//           Manager: row['Manager Name'] || '',
//           attendance: []
//         });
//       }

//       const record = attendanceMap.get(mobile);

//       for (const key of Object.keys(row)) {
//         if (isDateColumn(key)) {
//           const [day, mon, yr] = key.split('-');
//           const isoDate = `20${yr}-${monthToNum(mon)}-${pad(day)}`;
//           const status = row[key]?.trim() || 'A';
//           record.attendance.push({ date: isoDate, status });
//         }
//       }
//     }

//     let inserted = 0;

//     for (const item of attendanceMap.values()) {
//       try {
//         await db.docclient.send(new PutCommand({
//           TableName: ATTENDANCE_TABLE,
//           Item: item
//         }));
//         inserted++;
//       } catch (err) {
//         console.warn(`❌ Failed to insert ${item.Mobile}:`, err.message);
//       }
//     }

//     res.json({ message: `✅ Uploaded ${inserted} mobile records with attendance arrays.` });
//   } catch (err) {
//     console.error('❌ Error processing attendance:', err);
//     res.status(500).json({ error: 'Failed to process attendance sheet' });
//   }
// });

// module.exports = router;

// // Helpers
// function pad(n) {
//   return n.length === 1 ? '0' + n : n;
// }

// function monthToNum(mon) {
//   return {
//     Jan: '01', Feb: '02', Mar: '03', Apr: '04',
//     May: '05', Jun: '06', Jul: '07', Aug: '08',
//     Sep: '09', Oct: '10', Nov: '11', Dec: '12',
//   }[mon] || '00';
// }

// function isDateColumn(colName) {
//   return /^\d{1,2}-[A-Za-z]{3}-\d{2}$/.test(colName);
// }



const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const { BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const dynamo = require('../service/dynamodbmanager');
const router = express.Router();
const ATTENDANCE_TABLE = 'Attendance';
const db = new dynamo();

const FINANCIAL_TIMELINE = 'June 2025';

router.get('/sync', async (req, res) => {
  try {
    const workbook = XLSX.readFile(path.join(__dirname, '../June WH Salary Data.xlsx'));
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets['WH Consol Input'], { range: 1, defval: '' });

    const attendanceMap = new Map();

    for (const row of sheet) {
      const mobile = row['Mobile']?.toString().trim();
      if (!mobile) continue;

      if (!attendanceMap.has(mobile)) {
        attendanceMap.set(mobile, {
          Mobile: mobile,
          Name: row['Name'] || '',
          WH: row['WH Name'] || '',
          City: row['City'] || '',
          State: row['State'] || '',
          Designation: row['Designation'] || '',
          Department: row['Department'] || '',
          Vendor: row['Vendor'] || '',
          DOJ: formatDateFromExcel(row['DOJ (DD-MMM-YY)']),
          Manager: row['Manager Name'] || '',
          FinancialTimeline: FINANCIAL_TIMELINE,
          attendance: []
        });
      }

      const record = attendanceMap.get(mobile);

      for (const key of Object.keys(row)) {
        if (isDateColumn(key)) {
          const [day, mon, yr] = key.split('-');
          const isoDate = `20${yr}-${monthToNum(mon)}-${pad(day)}`;
          const status = row[key]?.trim() || 'A';
          record.attendance.push({ date: isoDate, status });
        }
      }
    }

    const allItems = Array.from(attendanceMap.values());
    const BATCH_SIZE = 25;
    let inserted = 0;

    for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
      const batch = allItems.slice(i, i + BATCH_SIZE).map(item => ({
        PutRequest: { Item: item }
      }));

      const params = {
        RequestItems: {
          [ATTENDANCE_TABLE]: batch
        }
      };

      try {
        await db.docclient.send(new BatchWriteCommand(params));
        inserted += batch.length;
      } catch (err) {
        console.warn(`❌ Batch insert failed at batch ${i / BATCH_SIZE + 1}:`, err.message);
      }
    }

    res.json({ message: `✅ Uploaded ${inserted} mobile records with attendance arrays.` });
  } catch (err) {
    console.error('❌ Error processing attendance:', err);
    res.status(500).json({ error: 'Failed to process attendance sheet' });
  }
});

module.exports = router;

// Helpers
function pad(n) {
  return n.toString().padStart(2, '0');
}

function monthToNum(mon) {
  return {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  }[mon] || '00';
}

function isDateColumn(colName) {
  return /^\d{1,2}-[A-Za-z]{3}-\d{2}$/.test(colName);
}

function formatDateFromExcel(excelDate) {
  if (!excelDate || isNaN(excelDate)) return '';
  const baseDate = new Date(1899, 11, 30);
  const doj = new Date(baseDate.getTime() + excelDate * 86400000);
  return doj.toISOString().split('T')[0]; // yyyy-mm-dd
}
