import React from 'react';
import { Clock } from 'lucide-react';

const AttendanceSummary = ({ attendance }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Attendance Summary
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Present Days</span>
          <span className="font-semibold text-orange-600">{attendance.present}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Absent Days</span>
          <span className="font-semibold text-red-600">{attendance.absent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Leave Days</span>
          <span className="font-semibold text-yellow-600">{attendance.leave}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-900 font-semibold">Attendance Rate</span>
          <span className="font-bold text-orange-600">{attendance.attendanceRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
