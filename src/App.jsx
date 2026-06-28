import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import UsersPage from './pages/UsersPage';
import Departments from './pages/Departments';
import './App.css';

function App() {
  // Trigger counters passed down from top-nav buttons inside DashboardLayout
  const [addUserTrigger, setAddUserTrigger] = useState(0);
  const [addDeptTrigger, setAddDeptTrigger] = useState(0);

  const handleAddUserClick = () => {
    setAddUserTrigger((prev) => prev + 1);
  };

  const handleAddDeptClick = () => {
    setAddDeptTrigger((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* All routes are nested under DashboardLayout to preserve sidebar navigation and top-nav layout */}
        <Route
          element={
            <DashboardLayout
              onAddUserClick={handleAddUserClick}
              onAddDeptClick={handleAddDeptClick}
            />
          }
        >
          {/* Landing path / renders UsersPage directly */}
          <Route path="/" element={<UsersPage addUserTrigger={addUserTrigger} />} />
          <Route path="/departments" element={<Departments addDeptTrigger={addDeptTrigger} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
