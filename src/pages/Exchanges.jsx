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
  console.log('userData', userData);
  // const [exchangesAvailables] = React.useState(userData.exchangesAvailable);

  const url = config.urlServer + ':' + config.port + '/exchanges'
  // recupere le tableau des exchanges 

  const [allExchanges, setAllExchanges] = React.useState([]);


  console.log('exchanges');

  React.useEffect(() => {
    // console.log(config)

    if (!AuthenticationService.isAuthenticated) {
      navigate("/login");
    }

    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userData.token
      },
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        setAllExchanges(data);
      })


    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {allExchanges && allExchanges.map((exchange, index) => (
          <CardExchange key={index}
            exchange={exchange}
            userData={userData}
          // exchangesAvailables={exchangesAvailables}
          />
        ))}

      </Box>

    </Container >
  )

};

export default Exchanges;