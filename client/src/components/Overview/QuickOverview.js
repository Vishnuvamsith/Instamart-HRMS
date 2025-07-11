import React from 'react';
import { Eye } from 'lucide-react';
import PayrollSummary from '../Payroll/PayrollSummary';
import AttendanceSummary from '../Attendance/AttendanceSummary';

const QuickOverview = ({ employee, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quick Overview</h2>
        <button
          onClick={onViewDetails}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600"
        >
          <Eye className="w-5 h-5 mr-2" />
          Detailed Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PayrollSummary payroll={employee.payroll} />
        <AttendanceSummary attendance={employee.attendance} />
      </div>
    </div>
  );
};

export default QuickOverview;