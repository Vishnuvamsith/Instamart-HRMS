const express = require('express');
const router = express.Router();
const db = new (require('../service/dynamodbmanager'))();
const redis = require('../service/redis'); // Redis client

// router.post('/findby', async (req, res) => {
//   const { Mobile, FinancialTimeline } = req.body;

//   if (!Mobile || !FinancialTimeline) {
//     return res.status(400).json({ error: 'Mobile and FinancialTimeline are required' });
//   }
//   const cacheKey = `record:${Mobile}:${FinancialTimeline}`;

//   try {
//     // 🔍 Check Redis cache
//     const cached = await redis.get(cacheKey);
//     if (cached) {
//       console.log('⚡ Served from cache');
//       return res.status(200).json({ message: 'From cache', data: JSON.parse(cached) });
//     }

//     // 🔍 Attendance Query (from GSI)
//     const attendanceParams = {
//       TableName: 'Attendance',
//       IndexName: 'Mobile-FinancialTimeline-index',
//       KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :ft',
//       ExpressionAttributeValues: {
//         ':mobile': Mobile,
//         ':ft': FinancialTimeline
//       }
//     };

//     // 🔍 Payroll Query (from main table)
//     const payrollParams = {
//       TableName: 'Payroll',
//       IndexName: 'Mobile-FinancialTimeline-index',
//       KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :ft',
//       ExpressionAttributeValues: {
//         ':mobile': Mobile,
//         ':ft': FinancialTimeline
//       }
//     };

//     const [attendanceResult, payrollResult] = await Promise.all([
//       db.queryItem(attendanceParams),
//       db.queryItem(payrollParams)
//     ]);

//     const response = {
//       attendance: attendanceResult.Items || [],
//       payroll: payrollResult.Items || []
//     };
//     if(!response)
//     {
//         res.status(404).json({message:"records not found"})
//     }

//     // 💾 Cache in Redis for 10 minutes (600s)
//     await redis.setEx(cacheKey, 600, JSON.stringify(response));
//     console.log('✅ Cached result');

//     res.status(200).json({ message: 'Fetched from DB', data: response });
//   } catch (err) {
//     console.error('❌ Query error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.post('/findby', async (req, res) => {
  const { Mobile, FinancialTimeline } = req.body;
  console.log(req.body)

  if (!Mobile || !FinancialTimeline) {
    return res.status(400).json({ error: 'Mobile and FinancialTimeline are required' });
  }
  
  const cacheKey = `record:${Mobile}:${FinancialTimeline}`;

  try {
    // 🔍 Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('⚡ Served from cache');
      return res.status(200).json({ message: 'From cache', data: JSON.parse(cached) });
    }

    // 🔍 Database queries
    const attendanceParams = {
      TableName: 'Attendance',
      IndexName: 'Mobile-FinancialTimeline-index',
      KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :ft',
      ExpressionAttributeValues: {
        ':mobile': Mobile,
        ':ft': FinancialTimeline
      }
    };

    const payrollParams = {
      TableName: 'Payroll',
      IndexName: 'Mobile-FinancialTimeline-index',
      KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :ft',
      ExpressionAttributeValues: {
        ':mobile': Mobile,
        ':ft': FinancialTimeline
      }
    };

    const [attendanceResult, payrollResult] = await Promise.all([
      db.queryItem(attendanceParams),
      db.queryItem(payrollParams)
    ]);

    const response = {
      attendance: attendanceResult.Items || [],
      payroll: payrollResult.Items || []
    };

    // ✅ Proper validation logic
    const hasAttendance = response.attendance.length > 0;
    const hasPayroll = response.payroll.length > 0;

    if (!hasAttendance && !hasPayroll) {
      return res.status(404).json({ 
        error: 'No records found',
        message: `No attendance or payroll records found for mobile ${Mobile} in ${FinancialTimeline}`,
        code: 'NO_RECORDS'
      });
    }

    if (!hasAttendance) {
      return res.status(206).json({ 
        message: 'Partial data found - missing attendance records',
        data: response,
        warning: 'NO_ATTENDANCE'
      });
    }

    if (!hasPayroll) {
      return res.status(206).json({ 
        message: 'Partial data found - missing payroll records',
        data: response,
        warning: 'NO_PAYROLL'
      });
    }

    // 💾 Cache successful results
    await redis.setEx(cacheKey, 600, JSON.stringify(response));
    console.log('✅ Cached result');

    res.status(200).json({ message: 'Fetched from DB', data: response });
  } catch (err) {
    console.error('❌ Query error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Database query failed. Please try again later.',
      code: 'DB_ERROR'
    });
  }
});

router.post('/attendance/fetch', async (req, res) => {
  const { Mobile, FinancialTimeline } = req.body;
  console.log(req.body)

  if (!Mobile || !FinancialTimeline) {
    return res.status(400).json({ error: 'Mobile and FinancialTimeline are required.' });
  }

  const cacheKey = `record:${Mobile}:${FinancialTimeline}`;

  try {
    // 1. Try to get from Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('✅ Cache hit');
      const data = JSON.parse(cached);
      console.log(data)

      if (!data.attendance) {
        return res.status(404).json({ message: 'No attendance data found in cache.' });
      }
      console.log(data.attendance)
      const summary = parseAttendance(data.attendance[0].attendance);
      return res.json({ message: '✅ Served from cache', attendance: summary });
    }

    console.log('🔍 Cache miss. Querying DynamoDB...');

    const params = {
      TableName: 'Attendance',
      IndexName: 'Mobile-FinancialTimeline-index',
      KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :timeline',
      ExpressionAttributeValues: {
        ':mobile': Mobile,
        ':timeline': FinancialTimeline
      }
    };

    const result = await db.queryItem(params);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: 'No attendance record found.' });
    }

    const record = result.Items[0];
    const summary = parseAttendance(record.attendance || []);

    // Optionally store full record in cache for reuse in other routes
    //await redisClient.set(cacheKey, JSON.stringify(record), 'EX', 3600);

    return res.json({ attendance: summary });

  } catch (err) {
    console.error('❌ Error fetching attendance:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/payroll/fetch', async (req, res) => {
  const { Mobile, FinancialTimeline } = req.body;
  console.log(req.body)

  if (!Mobile || !FinancialTimeline) {
    return res.status(400).json({ error: 'Mobile and FinancialTimeline are required.' });
  }

  const cacheKey = `record:${Mobile}:${FinancialTimeline}`; // unified record cache

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('✅ Payroll cache hit');
      const data = JSON.parse(cached);

      if (!data.payroll) {
        return res.status(404).json({ message: 'No payroll data found in cache.' });
      }
      console.log(data.payroll)
      const mapped = mapPayroll(data.payroll[0]);
      return res.json({ payroll: mapped });
    }

    console.log('🔍 Payroll cache miss. Querying DynamoDB.');
    const params = {
      TableName: 'Payroll',
      IndexName: 'Mobile-FinancialTimeline-index',
      KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :timeline',
      ExpressionAttributeValues: {
        ':mobile': Mobile,
        ':timeline': FinancialTimeline
      }
    };

    const result = await db.queryItem(params);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: 'No payroll record found.' });
    }

    const record = result.Items[0];
    //await redisClient.set(cacheKey, JSON.stringify(record), 'EX', 3600);

    const mapped = mapPayroll(record.payroll);
    return res.json({ payroll: mapped });

  } catch (err) {
    console.error('❌ Error fetching payroll:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/basic/fetch', async (req, res) => {
    console.log(req.body)
  const { Mobile, FinancialTimeline } = req.body;

  if (!Mobile || !FinancialTimeline) {
    return res.status(400).json({ error: 'Mobile and FinancialTimeline are required.' });
  }

  const cacheKey = `record:${Mobile}:${FinancialTimeline}`;

  try {
    // 🔍 Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('✅ Basic info cache hit');
      const data = JSON.parse(cached);
      console.log(data)
    
      if (!data.attendance) {
        return res.status(404).json({ message: 'No basic employee data in cache.' });
      }

      const mapped = mapBasic(data.attendance[0]);
      return res.json({ basic: mapped });
    }

    console.log('🔍 Cache miss. Querying DynamoDB for basic info...');

    const params = {
      TableName: 'Attendance', // or any reliable table where basic info is stored
      IndexName: 'Mobile-FinancialTimeline-index',
      KeyConditionExpression: 'Mobile = :mobile AND FinancialTimeline = :timeline',
      ExpressionAttributeValues: {
        ':mobile': Mobile,
        ':timeline': FinancialTimeline
      }
    };

    const result = await db.queryItem(params);

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: 'No employee record found.' });
    }

    const record = result.Items[0];

    //await redisClient.set(cacheKey, JSON.stringify(record), 'EX', 3600); // cache whole record

    const mapped = mapBasic(record);
    return res.json({ basic: mapped });

  } catch (err) {
    console.error('❌ Error fetching basic info:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// 🔧 Helper: map record to frontend `basic` shape




module.exports = router;

// 🧠 Helper: Parse attendance array to summary
function parseAttendance(attendanceArray) {
  const summary = {
    present: 0,
    absent: 0,
    leave: 0,
    attendanceRate: 0,
    dailyAttendance: []
  };

  for (const entry of attendanceArray) {
    const statusCode = entry.status?.toUpperCase() || 'A';

    let statusLabel = 'Absent';
    if (statusCode === 'P' || statusCode === 'NP') statusLabel = 'Present';
    else if (statusCode === 'L') statusLabel = 'Leave';

    summary.dailyAttendance.push({
      date: entry.date,
      status: statusLabel
    });

    if (statusLabel === 'Present') summary.present++;
    else if (statusLabel === 'Absent') summary.absent++;
    else if (statusLabel === 'Leave') summary.leave++;
  }

  const total = summary.present + summary.absent + summary.leave;
  summary.attendanceRate = total ? Math.round((summary.present / total) * 100) : 0;

  return summary;
}


// 🔧 Helper function
// function mapPayroll(raw) {
//   return {
//     basic: raw.Basic_1 || 0,
//     hra: raw.HRA_1 || 0,
//     splAllow: raw.Special_Allow || 0,
//     statsBonus: raw.Stats_Bonus_1 || 0,
//     gross: raw.Total_Gross || 0,
//     pfEmployee: raw.PF_Employee_1 || 0,
//     esicEmployee: raw.ESIC_Employee_1 || 0,
//     pt: raw.PT_1 || 0,
//     netPay: raw.Net_Pay || 0,
//     ctc: raw.Total_Bill_Ctc || 0,
//     bizWorkingDays: raw.Biz_Working_Days || 0,
//     empWorkedDays: raw.Employee_Worked_Days || 0,
//     otHours: raw.OT_Hours || 0,
//     otAmount: raw.OT_Amount || 0,
//     attendanceBonus: raw.Attendance_Bonus || 0,
//     totalGross: raw.Total_Gross || 0,
//     totalDeductions: raw.Total_Deductions || 0,
//     nightAllowance: raw.Night_Allowance || 0
//   };
// }

function mapPayroll(raw) {
  return {
    basic: raw.Basic_1 || 0,
    basicArrear: raw.Basic_Arrear || 0,
    hra: raw.HRA_1 || 0,
    hraArrear: raw.HRA_Arrear || 0,
    statsBonus: raw.Stats_Bonus_1 || 0,
    statsBonusArrear: raw.Stats_Bonus_Arrear || 0,
    splAllow: raw.Special_Allow || 0,
    splAllowArrear: raw.Special_Allowance_Arrear || 0,
    otAmount: raw.OT_Amount || 0,
    holidayPay: raw.Holiday_Pay || 0,
    attendanceBonus: raw.Attendance_Bonus || 0,
    fuelReimbursement: raw.Fuel_Reimbursement_Amount || 0,
    incentiveAmount: raw.Incentive_Amount || 0,
    nightAllowance: raw.Night_Allowance || 0,
    travelAllowance: raw.Travel_Allowance || 0,
    accommodationAllowance: raw.Accommodation_Allowance_Migrant || 0,
    retentionBonus: raw.Retention_Bonus || 0,
    leaveEncashment: raw.Leave_Encashment_Amount || 0,

    pfEmployee: raw.PF_Employee_1 || 0,
    pfArrear: raw.PF_Arrear || 0,
    esicEmployee: raw.ESIC_Employee_1 || 0,
    esicArrear: raw.ESIC_Arrear || 0,
    insuranceEmployee: raw.Insurance_Employee || 0,
    pt: raw.PT_1 || 0,
    lwfEmployee: raw.LWF_Employee || 0,
    otherDeductions: raw.Other_Deductions || 0,
    totalDeductions: raw.Total_Deductions || 0,

    gross: raw.Total_Gross || 0,
    netPay: raw.Net_Pay || 0,
    ctc: raw.Total_Bill_Ctc || 0,
    bizWorkingDays: raw.Biz_Working_Days || 0,
    empWorkedDays: raw.Employee_Worked_Days || 0,
    otHours: raw.OT_Hours || 0
  };
}


function mapBasic(record) {
  return {
    mobile: record.Mobile,
    name: record.Name,
    designation: record.Designation,
    department: record.Department,
    vendor: record.Vendor,
    city: record.City,
    state: record.State,
    whName: record.WH,
    doj: record.DOJ,
    manager: record.Manager,
    status: record.Status || 'Active',
  };
}