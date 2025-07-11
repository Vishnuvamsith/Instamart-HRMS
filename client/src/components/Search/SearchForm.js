// import React, { useState } from 'react';
// import { Search, Phone, Calendar } from 'lucide-react';
// import LoadingSpinner from '../Common/LoadingSpinner';

// const SearchForm = ({ onSearch, isLoading }) => {
//   const [searchMobile, setSearchMobile] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(''); // ⛔️ No default value

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (searchMobile.trim() && selectedMonth) {
//       onSearch(searchMobile, selectedMonth);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
//       <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
//           <div className="relative">
//             <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               value={searchMobile}
//               onChange={(e) => setSearchMobile(e.target.value)}
//               placeholder="Enter mobile number"
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
//           <div className="relative">
//             <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               required
//             >
//               <option value="">Select Month</option>
//               <option value="2025-06">June 2025</option>
//               <option value="2025-05">May 2025</option>
//               <option value="2025-04">April 2025</option>
//               <option value="2025-03">March 2025</option>
//               <option value="2025-02">February 2025</option>
//               <option value="2025-01">January 2025</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             disabled={!searchMobile || !selectedMonth || isLoading}
//             className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//           >
//             {isLoading ? <LoadingSpinner /> : <Search className="w-5 h-5" />}
//             <span>Search</span>
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SearchForm;

import React, { useState } from 'react';
import { Search, User, Calendar, RefreshCw } from 'lucide-react';

const SearchForm = ({ onSearch, isLoading, onNewSearch, hasResults, initialMobile = '', initialMonth = '2025-05' }) => {
  const [mobile, setMobile] = useState(initialMobile);
  const [month, setMonth] = useState(initialMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile.trim()) {
      onSearch(mobile.trim(), month);
    }
  };

  const handleNewSearch = () => {
    setMobile('');
    setMonth('2025-05');
    if (onNewSearch) {
      onNewSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Search className="w-6 h-6 mr-3" />
          Employee Search
        </h2>
        {hasResults && (
          <button
            onClick={handleNewSearch}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Search
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
              >
                <option value="2025-06">June 2025</option>
              </select>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search Employee
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;