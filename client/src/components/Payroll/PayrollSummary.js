import React from 'react';

const PayrollSummary = ({ payroll }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <span className="w-5 h-5 mr-2 flex items-center justify-center">₹</span>
        Payroll Summary
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Gross Salary</span>
          <span className="font-semibold">₹{payroll.gross?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deductions</span>
          <span className="font-semibold text-red-600">₹{payroll.totalDeductions?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-900 font-semibold">Net Pay</span>
          <span className="font-bold text-orange-600">₹{payroll.netPay?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;