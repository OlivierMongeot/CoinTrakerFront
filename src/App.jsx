import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard';
// import Wallets from './pages/Wallets';


const getData = async () => {
  let promess = await axios.get('kucoin/wallet');
  console.log(promess.data.filtred);

}

function App() {

  React.useEffect(() => {

    // getData();


  }, []
  )

  // let promess = await axios.get('kucoin/wallet');
  // console.log(promess.data);

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
