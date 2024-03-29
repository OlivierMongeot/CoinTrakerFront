import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Theme from './Theme';


function App() {

  const [forceUpdate, setForceUpdate] = React.useState(false);

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Theme area="home" />} />
        <Route path="/login" element={<Theme area="login" />} />
        {/* <Route path="/wallets" element={<Wallets />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />*/}
        <Route path="/customize" element={<Theme area="customize" setForceUpdate={setForceUpdate} />} />
        <Route path="/registration" element={<Theme area="registration" />} />
        <Route path="/wallets" element={<Theme area="wallets" />} />
      </Routes>
    </Router>
  );
}

export default App;
