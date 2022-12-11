import React from 'react';
// import { useForm } from 'react-hook-form';
import axios from 'axios';
import config from '../config';
import CssBaseline from '@mui/material/CssBaseline';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



const Exchanges = () => {

  const handleSubmit = (event) => {

    event.preventDefault();

    const dataRow = new FormData(event.currentTarget);
    const data = {
      email: dataRow.get('email'),
      password: dataRow.get('password'),
      firstname: dataRow.get('firstname'),
      lastname: dataRow.get('lastname'),
      c_password: dataRow.get('c_password')
    };

    // Check if password match
    if (data.c_password !== data.password) {
      // return false;
    }

    console.log(data);
    // let url = "http://192.168.0.46:4000";
    // axios.post(url + '/register', data)
    //     .then(res => {
    //         console.log(res.data);
    //     }
    //     )
    //     .catch(err => {
    //         console.log(err);
    //     }
    //     );





  };


  React.useEffect(() => {
    console.log(config)

    // Get  All exchanges from config env 
  }, []);


  // const { register, handleSubmit, formState: { errors } } = useForm();

  // //send data to server
  // const onSubmit = data => {

  //     console.log(data);
  //     // make post request to api 
  //     // set Header
  //     let url = "http://192.168.0.46:4000";
  //     axios.post(url + '/register', data)
  //         .then(res => {
  //             console.log(res.data);
  //         }
  //         )
  //         .catch(err => {
  //             console.log(err);
  //         }
  //         );
  // }
  // // console.log(watch('email'));

  return (

    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
        }}
      >
        <Card sx={{ maxWidth: 345, m: 1 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="130"
            width="300"
            image={config.urlServer + ':' + config.port + "/images/coinbase.png"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Coinbase
            </Typography>

          </CardContent>
          <CardActions>
            <Button size="small">Connect</Button>

          </CardActions>
        </Card>

        <Card sx={{ maxWidth: 345, m: 1 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="130"
            image={config.urlServer + ':' + config.port + "/images/binance.png"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Binance
            </Typography>

          </CardContent>
          <CardActions>
            <Button size="small">Connect</Button>
          </CardActions>
        </Card>



      </Box>

    </Container >
  )

};

export default Exchanges;