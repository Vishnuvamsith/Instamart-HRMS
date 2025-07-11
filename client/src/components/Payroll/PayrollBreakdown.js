// import React from 'react';
// import { TrendingUp, AlertCircle } from 'lucide-react';

// const PayrollBreakdown = ({ payroll }) => {
//   const earnings = [
//     { label: 'Basic', amount: payroll.basic },
//     { label: 'HRA', amount: payroll.hra },
//     { label: 'Special Allowance', amount: payroll.splAllow },
//     { label: 'Stats Bonus', amount: payroll.statsBonus },
//     { label: 'OT Amount', amount: payroll.otAmount },
//     { label: 'Attendance Bonus', amount: payroll.attendanceBonus },
//     { label: 'Night allowance', amount: payroll.nightAllowance }
//   ];

//   const deductions = [
//     { label: 'PF Employee', amount: payroll.pfEmployee },
//     { label: 'ESIC Employee', amount: payroll.esicEmployee },
//     { label: 'PT', amount: payroll.pt }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="bg-orange-50 p-6 rounded-xl">
//         <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
//           <TrendingUp className="w-5 h-5 mr-2" />
//           Earnings
//         </h4>
//         <div className="space-y-3">
//           {earnings.map((item, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <span className="text-gray-700">{item.label}</span>
//               <span className="font-medium text-orange-700">₹{item.amount?.toLocaleString()}</span>
//             </div>
//           ))}
//           <div className="border-t pt-3 mt-3">
//             <div className="flex justify-between items-center font-semibold text-orange-800">
//               <span>Total Gross</span>
//               <span>₹{payroll.totalGross?.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-red-50 p-6 rounded-xl">
//         <h4 className="font-semibold text-red-800 mb-4 flex items-center">
//           <AlertCircle className="w-5 h-5 mr-2" />
//           Deductions
//         </h4>
//         <div className="space-y-3">
//           {deductions.map((item, index) => (
//             <div key={index} className="flex justify-between items-center">
//               <span className="text-gray-700">{item.label}</span>
//               <span className="font-medium text-red-700">₹{item.amount?.toLocaleString()}</span>
//             </div>
//           ))}
//           <div className="border-t pt-3 mt-3">
//             <div className="flex justify-between items-center font-semibold text-red-800">
//               <span>Total Deductions</span>
//               <span>₹{payroll.totalDeductions?.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayrollBreakdown;


import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

const PayrollBreakdown = ({ payroll }) => {
  // Define all possible earnings fields
  const allEarnings = [
    { label: 'Basic', amount: payroll.basic },
    { label: 'Basic Arrear', amount: payroll.basicArrear },
    { label: 'HRA', amount: payroll.hra },
    { label: 'HRA Arrear', amount: payroll.hraArrear },
    { label: 'Special Allowance', amount: payroll.splAllow },
    { label: 'Special Allowance Arrear', amount: payroll.splAllowArrear },
    { label: 'Stats Bonus', amount: payroll.statsBonus },
    { label: 'Stats Bonus Arrear', amount: payroll.statsBonusArrear },
    { label: 'OT Amount', amount: payroll.otAmount },
    { label: 'Holiday Pay', amount: payroll.holidayPay },
    { label: 'Attendance Bonus', amount: payroll.attendanceBonus },
    { label: 'Fuel Reimbursement', amount: payroll.fuelReimbursement },
    { label: 'Incentive Amount', amount: payroll.incentiveAmount },
    { label: 'Night Allowance', amount: payroll.nightAllowance },
    { label: 'Travel Allowance', amount: payroll.travelAllowance },
    { label: 'Accommodation Allowance', amount: payroll.accommodationAllowance },
    { label: 'Retention Bonus', amount: payroll.retentionBonus },
    { label: 'Leave Encashment', amount: payroll.leaveEncashment }
  ];

  // Define all possible deductions fields
  const allDeductions = [
    { label: 'PF Employee', amount: payroll.pfEmployee },
    { label: 'PF Arrear', amount: payroll.pfArrear },
    { label: 'ESIC Employee', amount: payroll.esicEmployee },
    { label: 'ESIC Arrear', amount: payroll.esicArrear },
    { label: 'Insurance Employee', amount: payroll.insuranceEmployee },
    { label: 'PT', amount: payroll.pt },
    { label: 'LWF Employee', amount: payroll.lwfEmployee },
    { label: 'Other Deductions', amount: payroll.otherDeductions }
  ];

  // Filter out fields with zero or null/undefined values
  const earnings = allEarnings.filter(item => item.amount && item.amount > 0);
  const deductions = allDeductions.filter(item => item.amount && item.amount > 0);

  // Calculate totals from filtered items
  const totalGross = earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalDeductionsCalc = deductions.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Earnings Section */}
      <div className="bg-orange-50 p-6 rounded-xl">
        <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Earnings
        </h4>
        <div className="space-y-3">
          {earnings.length > 0 ? (
            earnings.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-medium text-orange-700">₹{item.amount?.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No earnings to display</div>
          )}
          {earnings.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold text-orange-800">
                <span>Total Gross</span>
                <span>₹{(payroll.gross || totalGross)?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deductions Section */}
      <div className="bg-red-50 p-6 rounded-xl">
        <h4 className="font-semibold text-red-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Deductions
        </h4>
        <div className="space-y-3">
          {deductions.length > 0 ? (
            deductions.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-medium text-red-700">₹{item.amount?.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No deductions to display</div>
          )}
          {deductions.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold text-red-800">
                <span>Total Deductions</span>
                <span>₹{(payroll.totalDeductions || totalDeductionsCalc)?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollBreakdown;