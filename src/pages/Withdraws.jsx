import * as React from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import config from '../config';

const Withdraws = () => {




  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Withdraws')


    axios({
      url: config.urlServer + '/coinbase/withdraws',
      method: 'post',
      headers: {
        authorization: userData.token
      }, data: {
        email: userData.email,
        exchange: 'kucoin'
      }
    })
      .then(res => {

        console.log('Result DB request ', res);

      }
      )
      .catch(err => {
        console.log(err);
      }
      );





  })


  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%'
    }}
    >
      TOTO


    </Container>
  )



}

export default Withdraws;
