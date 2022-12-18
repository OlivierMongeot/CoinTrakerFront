import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import AuthenticationService from '../src/helpers/AuthService';

export default function SignIn() {

  const navigate = useNavigate();

  const handleError = (err) => {
    console.log(err);
    toast(err.response.data.error);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const dataRow = new FormData(event.currentTarget);
    const data = {
      email: dataRow.get('email'),
      password: dataRow.get('password')
    };

    console.log(data.email);
    let url = "http://192.168.0.46:4000";
    axios.post(url + '/login', data)
      .then(res => {
        // console.log(res.data);
        if (res.data.token) {

          const user = {
            lastname: res.data.data.lastname,
            email: res.data.data.email,
            id: res.data.data.id,
            apiKeys: res.data.data.apiKeys,
            exchanges: res.data.data.exchanges,
            phone: res.data.data.phone,
            roles: res.data.data.roles,
            token: res.data.token
          };
          console.log('user', user);
          localStorage.setItem('user', JSON.stringify(user));
          AuthenticationService.isAuthenticated = true;
          navigate("/wallets");

        } else {
          AuthenticationService.isAuthenticated = false;

        }
      }
      )
      .catch(err => {
        handleError(err);
      }
      );
  };


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
      <ToastContainer />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
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
                autoComplete=""
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                autoComplete='nope'
                label="Password"
                // type="password"
                id="password"
                inputProps={{
                  // type: "password",
                  autoComplete: 'nope',
                }}
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                You don't already have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

    </Container>
    // </ThemeProvider>
  );
}