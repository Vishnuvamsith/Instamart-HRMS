import React from 'react';

const AttendanceCalendar = ({ dailyAttendance }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'Leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-medium text-gray-600 p-2">
          {day}
        </div>
      ))}
      {dailyAttendance.slice(0, 31).map((day, index) => (
        <div key={index} className={`p-2 rounded-lg border text-center text-sm ${getStatusColor(day.status)}`}>
          <div className="font-medium">{new Date(day.date).getDate()}</div>
          <div className="text-xs">{day.status.charAt(0)}</div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceCalendar;