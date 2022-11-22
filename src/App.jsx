import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';


function App() {


  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} />
      <Route path="/wallets" element={<Wallets />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} /> */}
        <Route path="/" element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
