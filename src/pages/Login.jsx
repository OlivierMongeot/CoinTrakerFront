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
import AuthenticationService from '../helpers/AuthService';
import config from '../config';

const Log_in = () => {

    const navigate = useNavigate();

    if (!navigator.onLine) {
        console.log('offline');
        toast('You are offline')
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataRow = new FormData(event.currentTarget);
        const data = {
            email: dataRow.get('email'),
            password: dataRow.get('password')
        };

        console.log(data.email);
        let url = "http://" + config.urlServer;
        axios.post(url + '/login', data)
            .then(res => {

                if (res.data.token) {

                    const user = {
                        lastname: res.data.data.lastname,
                        email: res.data.data.email,
                        id: res.data.data.id,
                        // apiKeys: res.data.data.apiKeys,
                        // exchangesEnable: res.data.data.exchanges,
                        phone: res.data.data.phone,
                        roles: res.data.data.roles,
                        token: res.data.token,
                        exchangesActive: res.data.data.exchangesActive
                    };
                    console.log('user Logged OK', user);
                    localStorage.setItem('user', JSON.stringify(user));
                    AuthenticationService.isAuthenticated = true;
                    console.log('navigate to last page');
                    navigate(-1);

                } else {
                    AuthenticationService.isAuthenticated = false;
                }
            }
            )
            .catch(error => {
                // console.log(err);
                // console.log(err.message)
                // toast(err.message);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    toast(error.response.status);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    toast("Error : no server response");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    toast(error.message);
                }
                console.log(error.config);
            }
            );
    };

    const styleContainer = {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '80%'
    }

    const styleBox = {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }

    return (

        <Container component="main" maxWidth="xs" sx={styleContainer} >
            <CssBaseline />
            <ToastContainer />
            <Box sx={styleBox} >
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
                                autoComplete="country"
                                label="Password"
                                type="password"
                                id="password"
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
    )

};

export default Log_in;