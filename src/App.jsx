import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Theme from './Theme';


function App() {

  const [forceUpdate, setForceUpdate] = React.useState(false);

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Theme page="home" />} />
        <Route path="/login" element={<Theme page="login" />} />
        <Route path="/exchanges" element={<Theme page="exchanges" />} />

        <Route path="/account" element={<Theme page="account" />} />
        <Route path="/customize" element={<Theme page="customize" setForceUpdate={setForceUpdate} />} />
        <Route path="/registration" element={<Theme page="registration" />} />
        <Route path="/wallets" element={<Theme page="wallets" />} />
      </Routes>
    </Router>
  );
}

export default App;
