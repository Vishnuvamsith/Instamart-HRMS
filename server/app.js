const express = require('express');
const cors = require('cors');
const app = express();
const crud=require('./routes/crud')
const attendance=require('./routes/attendanceRoute')
const payroll=require('./routes/payrollRoute')
const attencrud=require('./routes/attendancepayrollCrud')
const path = require('path');
const PORT = 5001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/crud',crud)
app.use('/attendance',attendance)
app.use('/payroll',payroll)
app.use('/atten',attencrud)
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});