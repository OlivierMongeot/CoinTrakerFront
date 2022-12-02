import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { createTheme } from '@mui/material/styles';
import axios from 'axios';
import AuthenticationService from '../helpers/AuthService';
// const theme = createTheme();
import { useNavigate } from "react-router-dom";


export default function SignIn() {

  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    const dataRow = new FormData(event.currentTarget);
    const data = {
      email: dataRow.get('email'),
      password: dataRow.get('password')
    };



    console.log(data);
    let url = "http://192.168.0.46:4000";
    axios.post(url + '/login', data)
      .then(res => {
        // console.log(res.data);
        if (res.data.token) {
          console.log(res.data);
          // console.log(res.data.token);
          // set token in localStorage
          const user = {
            lastname: res.data.data.lastname,
            email: res.data.data.email,
            id: res.data.data.id,
            token: res.data.token,
            exchanges: res.data.exchanges
          };
          localStorage.setItem('user', JSON.stringify(user));
          AuthenticationService.isAuthenticated = true;
          navigate("/");

        } else {
          AuthenticationService.isAuthenticated = false;

        }
      }
      )
      .catch(err => {
        console.log(err);
      }
      );



  };

  return (
    // <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80%'
    }}
    >
      <CssBaseline />
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
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              // autoComplete="new-password"
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