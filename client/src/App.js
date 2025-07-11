import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import EmployeeSearch from './pages/EmployeeSearch';
import EmployeeDetails from './pages/EmployeeDetails';
import './App.css';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<EmployeeSearch />} />
          <Route path="/employee/:mobile" element={<EmployeeDetails />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EmployeeSummaryPage from './pages/EmployeeSummary';
// import EmployeeDetails from './pages/EmployeeDetails';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<EmployeeSummaryPage />} />
//         <Route path="/employee/:mobile/details" element={<EmployeeDetails />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
