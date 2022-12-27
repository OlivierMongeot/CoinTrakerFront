import * as React from 'react';
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import AuthenticationService from '../helpers/AuthService';
// import { useEffect } from 'react';
import config from '../config';


export default function Account() {

  const navigate = useNavigate();

  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');


  const url = "http://" + config.urlServer;

  const [fieldAvaildable, setFieldAvaildable] = React.useState(true);

  React.useEffect(() => {

    if (!AuthenticationService.isAuthenticated) {
      navigate("/login");
    }

    const userData = JSON.parse(localStorage.getItem("user"))

    axios.post(url + '/user', {
      email: userData.email
    })
      .then(res => {
        // console.log(res.data);
        if (res.data) {

          const user = {
            lastname: res.data.data.lastname,
            firstname: res.data.data.firstname,
            email: res.data.data.email,
            id: res.data.data.id,
            token: res.data.data.token,
            exchanges: res.data.data.exchanges,
            phone: res.data.data.phone,
            apiKeys: res.data.data.apiKeys,
            is_verified: res.data.data.is_verified
          };

          setLastName(user.lastname);
          setFirstName(user.firstname);
          setEmail(user.email);
          setPhone(user.phone);
        }
      }
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const validateChangeUser = (event) => {
    event.preventDefault();
    console.log(event.target);
    setFieldAvaildable(() => {
      return fieldAvaildable === true ? false : true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.email.value);

    const data = {
      email: e.target.email.value,
      firstName: e.target.firstname.value,
      lastName: e.target.lastname.value,
      phone: e.target.phone.value,
    };


    axios.post(url + '/updateuser', data)
      .then(res => {
        console.log(res.data);
        // if (res.data.token) {
        //   // console.log(res.data);
        //   // console.log(res.data.token);
        //   // set token in localStorage
        //   const user = {
        //     lastname: res.data.data.lastname,
        //     email: res.data.data.email,
        //     id: res.data.data.id,
        //     token: res.data.token,
        //     exchanges: res.data.exchanges
        //   };
        //   localStorage.setItem('user', JSON.stringify(user));
        //   AuthenticationService.isAuthenticated = true;
        //   navigate("/wallets");

        // } else {
        //   AuthenticationService.isAuthenticated = false;

        // }
      }
      )



  }

  const handleChangeLastName = (e) => {
    console.log(e)
    setLastName(e.target.value);
  }
  const handleChangeFirstName = (e) => {
    console.log(e)
    setFirstName(e.target.value);
  }
  const handleChangeEmail = (e) => {
    console.log(e)
    setEmail(e.target.value);
  }

  const handleChangePhone = (e) => {
    console.log(e)
    setPhone(e.target.value);
  }


  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%'
    }}
    >

      <CssBaseline />
      {/* <ToastContainer /> */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >


        <Typography component="h1" variant="h5">
          Your data
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={handleChangeEmail}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                disabled={fieldAvaildable}
                fullWidth
                name="lasttname"
                label="Lastname"
                id="lastname"
                onChange={handleChangeLastName}
                value={lastName}

                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                disabled={fieldAvaildable}
                fullWidth
                name="firstname"
                label="Firstname"
                id="firstname"
                value={firstName}
                onChange={handleChangeFirstName}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>



            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone number"
                name="phone"
                value={phone}
                disabled={fieldAvaildable}
                onChange={handleChangePhone}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="valid-account"
                label="Valid Account"
                name="valid-account"
                value={is_verified}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid> */}


          </Grid>

          {fieldAvaildable && (
            <Button
              // type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={validateChangeUser}
            >

              <span>Modify</span>
            </Button>
          )}
          {!fieldAvaildable && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            // onClick={validateChangeUser}
            >
              <span>Validate</span>
            </Button>
          )}


        </Box>

      </Box>
    </Container>
  )

};


