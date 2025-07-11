// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ChevronRight, DollarSign, Clock } from 'lucide-react';
// import Header from '../components/Common/Header';
// import EmployeeProfile from '../components/Employee/EmployeeProfile';
// import PayrollBreakdown from '../components/Payroll/PayrollBreakdown';
// import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';
// import { mockEmployeeData } from '../data/mockData';

// const EmployeeDetails = () => {
//   const { mobile } = useParams();
//   const navigate = useNavigate();
  
//   // In real app, fetch employee data based on mobile
//   const employee = mockEmployeeData;

//   const backButton = (
//     <button
//       onClick={() => navigate('/')}
//       className="flex items-center text-orange-600 hover:text-orange-800"
//     >
//       <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
//       Back to Overview
//     </button>
//   );

//   return (
//     <>
//       <Header 
//         title="Detailed Employee Report" 
//         subtitle={`Comprehensive analysis for ${employee.basic.name}`}
//         backButton={backButton}
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-1">
//           <EmployeeProfile employee={employee} />
//         </div>

//         <div className="lg:col-span-2 space-y-8">
//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <DollarSign className="w-6 h-6 mr-3" />
//               Payroll Breakdown
//             </h3>
//             <PayrollBreakdown payroll={employee.payroll} />
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <Clock className="w-6 h-6 mr-3" />
//               Attendance Calendar
//             </h3>
//             <AttendanceCalendar dailyAttendance={employee.attendance.dailyAttendance} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeDetails;

// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { ChevronRight, DollarSign, Clock } from 'lucide-react';
// import Header from '../components/Common/Header';
// import EmployeeProfile from '../components/Employee/EmployeeProfile';
// import PayrollBreakdown from '../components/Payroll/PayrollBreakdown';
// import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';

// const EmployeeDetails = () => {
//   const { mobile } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const selectedMonth = location.state?.month || '2025-05';
//   const passedEmployee = location.state?.employee || null;

//   const [employee, setEmployee] = useState(passedEmployee);
//   const [loading, setLoading] = useState(!passedEmployee);

//   useEffect(() => {
//     if (!passedEmployee) {
//       console.error('❌ No employee data passed from EmployeeSearch.');
//       alert('No employee data found. Please search again.');
//       navigate('/');
//     }
//   }, [passedEmployee, navigate]);

//   const backButton = (
//     <button
//       onClick={() => navigate(-1)}
//       className="flex items-center text-orange-600 hover:text-orange-800"
//     >
//       <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
//       Back to Home
//     </button>
//   );

//   if (loading || !employee) return <p className="text-center">Loading...</p>;

//   return (
//     <>
//       <Header
//         title="Detailed Employee Report"
//         subtitle={`Comprehensive analysis for ${employee.basic.name}`}
//         backButton={backButton}
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-1">
//           <EmployeeProfile employee={employee} />
//         </div>

//         <div className="lg:col-span-2 space-y-8">
//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <DollarSign className="w-6 h-6 mr-3" />
//               Payroll Breakdown
//             </h3>
//             <PayrollBreakdown payroll={employee.payroll} />
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <Clock className="w-6 h-6 mr-3" />
//               Attendance Calendar
//             </h3>
//             <AttendanceCalendar dailyAttendance={employee.attendance.dailyAttendance} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, DollarSign, Clock } from 'lucide-react';
import Header from '../components/Common/Header';
import EmployeeProfile from '../components/Employee/EmployeeProfile';
import PayrollBreakdown from '../components/Payroll/PayrollBreakdown';
import AttendanceCalendar from '../components/Attendance/AttendanceCalendar';

const EmployeeDetails = () => {
  const { mobile } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedMonth = location.state?.month || '2025-05';
  const passedEmployee = location.state?.employee || null;
  const returnData = location.state?.returnTo || null;

  const [employee, setEmployee] = useState(passedEmployee);
  const [loading, setLoading] = useState(!passedEmployee);

  useEffect(() => {
    if (!passedEmployee) {
      console.error('❌ No employee data passed from EmployeeSearch.');
      alert('No employee data found. Please search again.');
      navigate('/');
    }
  }, [passedEmployee, navigate]);

  const handleBackToSummary = () => {
    if (returnData) {
      // Navigate back to search page with preserved state
      navigate('/', {
        state: {
          employee: returnData.employee,
          month: returnData.month
        }
      });
    } else {
      // Fallback to regular back navigation
      navigate(-1);
    }
  };

  const backButton = (
    <button
      onClick={handleBackToSummary}
      className="flex items-center text-orange-600 hover:text-orange-800 transition-colors"
    >
      <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
      Back to Summary
    </button>
  );

  if (loading || !employee) return <p className="text-center">Loading...</p>;

  return (
    <>
      <Header
        title="Detailed Employee Report"
        subtitle={`Comprehensive analysis for ${employee.basic.name}`}
        backButton={backButton}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <EmployeeProfile employee={employee} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3" />
              Payroll Breakdown
            </h3>
            <PayrollBreakdown payroll={employee.payroll} />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3" />
              Attendance Calendar
            </h3>
            <AttendanceCalendar dailyAttendance={employee.attendance.dailyAttendance} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetails;