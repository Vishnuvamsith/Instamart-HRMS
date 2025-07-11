// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Common/Header';
// import SearchForm from '../components/Search/SearchForm';
// import SummaryCards from '../components/Employee/SummaryCards';
// import QuickOverview from '../components/Overview/QuickOverview';
// import { mockEmployeeData } from '../data/mockData';

// const EmployeeSearch = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = async (mobile, month) => {
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setSelectedEmployee(mockEmployeeData);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleViewDetails = () => {
//     if (selectedEmployee) {
//       navigate(`/employee/${selectedEmployee.basic.mobile}`);
//     }
//   };

//   return (
//     <>
//       <Header 
//         title="Employee Dashboard" 
//         subtitle="Search and analyze employee payroll and attendance data" 
//       />
      
//       <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      
//       {selectedEmployee && (
//         <div className="space-y-8">
//           <SummaryCards employee={selectedEmployee} />
//           <QuickOverview employee={selectedEmployee} onViewDetails={handleViewDetails} />
//         </div>
//       )}
//     </>
//   );
// };

// export default EmployeeSearch;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Common/Header';
// import SearchForm from '../components/Search/SearchForm';
// import SummaryCards from '../components/Employee/SummaryCards';
// import QuickOverview from '../components/Overview/QuickOverview';

// const EmployeeSearch = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = async (mobile, month) => {
//     setIsLoading(true);
//     setSelectedMonth(month);
//     const financialTimeline = formatMonth(month); // Convert to "May 2025"

//     const payload = {
//       Mobile: mobile,
//       FinancialTimeline: financialTimeline
//     };

//     try {
//       // Step 1: Trigger Redis prefetch
//       const initRes = await fetch('http://127.0.0.1:5001/atten/findby', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const initJson = await initRes.json();
//       if (!initRes.ok || !initJson.data) throw new Error('Redis prefetch failed');

//       // Step 2: Fetch data from cache-backed APIs
//       const [attendanceRes, payrollRes, basicRes] = await Promise.all([
//         fetch('http://127.0.0.1:5001/atten/attendance/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json()),

//         fetch('http://127.0.0.1:5001/atten/payroll/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json()),

//         fetch('http://127.0.0.1:5001/atten/basic/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json())
//       ]);

//       if (attendanceRes && payrollRes && basicRes) {
//         setSelectedEmployee({
//           attendance: attendanceRes.attendance,
//           payroll: payrollRes.payroll,
//           basic: basicRes.basic
//         });
//       } else {
//         throw new Error('Data missing from one or more fetches');
//       }

//     } catch (err) {
//       console.error('❌ Error during employee search:', err);
//       alert('Failed to fetch employee data. Please try again.');
//       setSelectedEmployee(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewDetails = () => {
//     if (selectedEmployee) {
//       navigate(`/employee/${selectedEmployee.basic.mobile}`, {
//         state: {
//             month: selectedMonth,
//             employee: selectedEmployee
//         }
//     });
//     }
//   };

//   return (
//     <>
//       <Header 
//         title="Employee Dashboard" 
//         subtitle="Search and analyze employee payroll and attendance data" 
//       />
      
//       <SearchForm onSearch={handleSearch} isLoading={isLoading} />

//       {selectedEmployee && (
//         <div className="space-y-8">
//           <SummaryCards employee={selectedEmployee} />
//           <QuickOverview employee={selectedEmployee} onViewDetails={handleViewDetails} />
//         </div>
//       )}
//     </>
//   );
// };

// const formatMonth = (monthStr) => {
//   const [year, month] = monthStr.split('-');
//   const date = new Date(`${year}-${month}-01`);
//   return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' }); // e.g. May 2025
// };

// export default EmployeeSearch;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Header from '../components/Common/Header';
// import SearchForm from '../components/Search/SearchForm';
// import SummaryCards from '../components/Employee/SummaryCards';
// import QuickOverview from '../components/Overview/QuickOverview';

// const EmployeeSearch = () => {
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [searchedMobile, setSearchedMobile] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Restore state when coming back from detail page
//   useEffect(() => {
//     const state = location.state;
//     if (state?.employee && state?.month) {
//       setSelectedEmployee(state.employee);
//       setSelectedMonth(state.month);
//       setSearchedMobile(state.employee.basic.mobile);
//     }
//   }, [location.state]);

//   const handleSearch = async (mobile, month) => {
//     setIsLoading(true);
//     setSelectedMonth(month);
//     setSearchedMobile(mobile);
//     const financialTimeline = formatMonth(month);

//     const payload = {
//       Mobile: mobile,
//       FinancialTimeline: financialTimeline
//     };

//     try {
//       // Step 1: Trigger Redis prefetch
//       const initRes = await fetch('http://127.0.0.1:5001/atten/findby', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const initJson = await initRes.json();
//       if (!initRes.ok || !initJson.data) throw new Error('Redis prefetch failed');

//       // Step 2: Fetch data from cache-backed APIs
//       const [attendanceRes, payrollRes, basicRes] = await Promise.all([
//         fetch('http://127.0.0.1:5001/atten/attendance/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json()),

//         fetch('http://127.0.0.1:5001/atten/payroll/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json()),

//         fetch('http://127.0.0.1:5001/atten/basic/fetch', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         }).then(res => res.json())
//       ]);

//       if (attendanceRes && payrollRes && basicRes) {
//         const employeeData = {
//           attendance: attendanceRes.attendance,
//           payroll: payrollRes.payroll,
//           basic: basicRes.basic
//         };
//         setSelectedEmployee(employeeData);
        
//         // Update browser history with search results
//         window.history.replaceState({
//           employee: employeeData,
//           month: month,
//           mobile: mobile
//         }, '');
//       } else {
//         throw new Error('Data missing from one or more fetches');
//       }

//     } catch (err) {
//       console.error('❌ Error during employee search:', err);
//       alert('Failed to fetch employee data. Please try again.');
//       setSelectedEmployee(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewDetails = () => {
//     if (selectedEmployee) {
//       navigate(`/employee/${selectedEmployee.basic.mobile}`, {
//         state: {
//           month: selectedMonth,
//           employee: selectedEmployee,
//           // Add return state for back navigation
//           returnTo: {
//             employee: selectedEmployee,
//             month: selectedMonth
//           }
//         }
//       });
//     }
//   };

//   const handleNewSearch = () => {
//     setSelectedEmployee(null);
//     setSelectedMonth(null);
//     setSearchedMobile('');
//     // Clear browser history state
//     window.history.replaceState({}, '');
//   };

//   return (
//     <>
//       <Header 
//         title="Employee Dashboard" 
//         subtitle="Search and analyze employee payroll and attendance data" 
//       />
      
//       <SearchForm 
//         onSearch={handleSearch} 
//         isLoading={isLoading}
//         onNewSearch={handleNewSearch}
//         hasResults={!!selectedEmployee}
//         initialMobile={searchedMobile}
//         initialMonth={selectedMonth || '2025-05'}
//       />

//       {selectedEmployee && (
//         <div className="space-y-8">
//           <SummaryCards employee={selectedEmployee} />
//           <QuickOverview employee={selectedEmployee} onViewDetails={handleViewDetails} />
//         </div>
//       )}
//     </>
//   );
// };

// const formatMonth = (monthStr) => {
//   const [year, month] = monthStr.split('-');
//   const date = new Date(`${year}-${month}-01`);
//   return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
// };

// export default EmployeeSearch;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Common/Header';
import SearchForm from '../components/Search/SearchForm';
import SummaryCards from '../components/Employee/SummaryCards';
import QuickOverview from '../components/Overview/QuickOverview';
import ErrorDisplay from '../components/Common/ErrorDisplay';

const EmployeeSearch = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchedMobile, setSearchedMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore state when coming back from detail page
  useEffect(() => {
    const state = location.state;
    if (state?.employee && state?.month) {
      setSelectedEmployee(state.employee);
      setSelectedMonth(state.month);
      setSearchedMobile(state.employee.basic.mobile);
    }
  }, [location.state]);

  const handleSearch = async (mobile, month) => {
    setIsLoading(true);
    setError(null);
    setSelectedEmployee(null);
    setSelectedMonth(month);
    setSearchedMobile(mobile);
    setLastSearchParams({ mobile, month });
    
    const financialTimeline = formatMonth(month);

    const payload = {
      Mobile: mobile,
      FinancialTimeline: financialTimeline
    };

    try {
      // Step 1: Check if records exist
      const initRes = await fetch('http://52.77.189.58:5001/atten/findby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const initJson = await initRes.json();

      // Handle different response scenarios
      if (initRes.status === 404) {
        setError({
          type: 'NO_RECORDS',
          message: initJson.message || `No records found for mobile ${mobile} in ${financialTimeline}`
        });
        return;
      }

      if (initRes.status === 206) {
        // Partial data - show warning but continue
        setError({
          type: 'PARTIAL_DATA',
          message: initJson.message || 'Some data may be missing for this period'
        });
      }

      if (!initRes.ok) {
        throw new Error(initJson.message || 'Failed to fetch employee records');
      }

      if (!initJson.data) {
        throw new Error('No data returned from server');
      }

      // Step 2: Fetch detailed data from cache-backed APIs
      const [attendanceRes, payrollRes, basicRes] = await Promise.all([
        fetch('http://52.77.189.58:5001/atten/attendance/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(async res => {
          const data = await res.json();
          return { ok: res.ok, data, status: res.status };
        }),

        fetch('http://52.77.189.58:5001/atten/payroll/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(async res => {
          const data = await res.json();
          return { ok: res.ok, data, status: res.status };
        }),

        fetch('http://52.77.189.58:5001/atten/basic/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(async res => {
          const data = await res.json();
          return { ok: res.ok, data, status: res.status };
        })
      ]);

      // Check if basic info (employee details) is available
      if (!basicRes.ok || !basicRes.data?.basic) {
        throw new Error('Employee basic information not found. This employee may not exist in the system.');
      }

      const employeeData = {
        attendance: attendanceRes.ok ? attendanceRes.data.attendance : null,
        payroll: payrollRes.ok ? payrollRes.data.payroll : null,
        basic: basicRes.data.basic
      };

      setSelectedEmployee(employeeData);
      
      // Update browser history with search results
      window.history.replaceState({
        employee: employeeData,
        month: month,
        mobile: mobile
      }, '');

    } catch (err) {
      console.error('❌ Error during employee search:', err);
      
      setError({
        type: 'GENERAL_ERROR',
        message: err.message || 'Failed to fetch employee data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (selectedEmployee) {
      navigate(`/employee/${selectedEmployee.basic.mobile}`, {
        state: {
          month: selectedMonth,
          employee: selectedEmployee,
          // Add return state for back navigation
          returnTo: {
            employee: selectedEmployee,
            month: selectedMonth
          }
        }
      });
    }
  };

  const handleNewSearch = () => {
    setSelectedEmployee(null);
    setSelectedMonth(null);
    setSearchedMobile('');
    setError(null);
    setLastSearchParams(null);
    // Clear browser history state
    window.history.replaceState({}, '');
  };

  const handleRetry = () => {
    if (lastSearchParams) {
      handleSearch(lastSearchParams.mobile, lastSearchParams.month);
    }
  };

  return (
    <>
      <Header 
        title="Employee Dashboard" 
        subtitle="Search and analyze employee payroll and attendance data" 
      />
      
      <SearchForm 
        onSearch={handleSearch} 
        isLoading={isLoading}
        onNewSearch={handleNewSearch}
        hasResults={!!selectedEmployee}
        initialMobile={searchedMobile}
        initialMonth={selectedMonth || '2025-05'}
      />

      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={handleRetry}
          searchParams={lastSearchParams}
        />
      )}

      {selectedEmployee && !error && (
        <div className="space-y-8">
          <SummaryCards employee={selectedEmployee} />
          <QuickOverview employee={selectedEmployee} onViewDetails={handleViewDetails} />
        </div>
      )}
    </>
  );
};

const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
};

export default EmployeeSearch;