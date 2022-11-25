import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
// import Home from './pages/Home';


function App() {



  return (

    <Router>
      <Routes>
        <Route path="/" element={<Dashboard area="home" />} />
        {/* <Route path="/wallets" element={<Wallets />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} /> */}
        <Route path="/wallets" element={<Dashboard area="wallets" />} />
      </Routes>
    </Router>
  );
}

export default App;
