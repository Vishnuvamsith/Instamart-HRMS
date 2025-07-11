// import React from 'react';
// import { User, DollarSign, Clock, TrendingUp } from 'lucide-react';

// const SummaryCards = ({ employee }) => {
//   const { basic, payroll, attendance } = employee;

//   const cards = [
//     {
//       icon: User,
//       title: basic.name,
//       subtitle: basic.designation,
//       bgColor: 'bg-orange-100',
//       iconColor: 'text-orange-600',
//       badge: basic.status,
//       badgeColor: 'text-green-600 bg-green-100'
//     },
//     {
//       icon: DollarSign,
//       title: `₹${payroll.netPay?.toLocaleString()}`,
//       subtitle: 'Net Pay',
//       bgColor: 'bg-green-100',
//       iconColor: 'text-green-600'
//     },
//     {
//       icon: Clock,
//       title: `${attendance.attendanceRate}%`,
//       subtitle: 'Attendance Rate',
//       bgColor: 'bg-yellow-100',
//       iconColor: 'text-yellow-600'
//     },
//     {
//       icon: TrendingUp,
//       title: `${payroll.otHours}h`,
//       subtitle: 'Overtime Hours',
//       bgColor: 'bg-red-100',
//       iconColor: 'text-red-600'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card, index) => (
//         <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className={`p-3 ${card.bgColor} rounded-lg`}>
//               <card.icon className={`w-6 h-6 ${card.iconColor}`} />
//             </div>
//             {card.badge && (
//               <span className={`text-sm font-medium px-2 py-1 rounded ${card.badgeColor}`}>
//                 {card.badge}
//               </span>
//             )}
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
//           <p className="text-gray-600 text-sm">{card.subtitle}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SummaryCards;

import React from 'react';
import { User, Clock, TrendingUp } from 'lucide-react';

const SummaryCards = ({ employee }) => {
  const { basic, payroll, attendance } = employee;

  const cards = [
    {
      icon: User,
      title: basic.name,
      subtitle: `${basic.designation} • ${basic.department} • ${basic.whName}`,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: basic.status,
      badgeColor: 'text-green-600 bg-green-100'
    },
    {
      icon: () => <span className="text-xl font-medium">₹</span>, // Replaced DollarSign with rupee symbol
      title: `₹${payroll.netPay?.toLocaleString()}`,
      subtitle: 'Net Pay',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Clock,
      title: `${attendance.attendanceRate}%`,
      subtitle: 'Attendance Rate',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      title: `${payroll.otHours}h`,
      subtitle: 'Overtime Hours',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${card.bgColor} rounded-lg`}>
              {typeof card.icon === 'function' ? (
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              ) : (
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              )}
            </div>
            {card.badge && (
              <span className={`text-sm font-medium px-2 py-1 rounded ${card.badgeColor}`}>
                {card.badge}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
          <p className="text-gray-600 text-sm">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;