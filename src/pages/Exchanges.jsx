import React from 'react';

import config from '../config';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
import AuthenticationService from '../helpers/AuthService';
import { useNavigate } from "react-router-dom";

import CardExchange from '../components/CardExchange';

const Exchanges = () => {

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));

  const [exchangesAvailables, setExchangesAvailables] = React.useState(userData.exchangesAvailable);

  const [apiArray, setApiArray] = React.useState([]);

  React.useEffect(() => {
    // console.log(config)

    if (!AuthenticationService.isAuthenticated) {
      navigate("/login");
    }


  }, []);




  return (

    <Container component="main" >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {exchangesAvailables && exchangesAvailables.map((exchange, index) => (
          <CardExchange key={index} exchange={exchange} userData={userData} />
        ))}

      </Box>

    </Container >
  )

};

export default Exchanges;