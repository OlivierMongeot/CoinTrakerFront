import React from 'react';
// import { useForm } from 'react-hook-form';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Registration = () => {

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
        let url = "http://192.168.0.46:4000";
        axios.post(url + '/register', data)
            .then(res => {
                console.log(res.data);
            }
            )
            .catch(err => {
                console.log(err);
            }
            );



    };


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

    // return (
    //     // Make form for registration
    //     <div className="registration-container">
    //         <h1>Registration</h1>
    //         <form onSubmit={handleSubmit(onSubmit)} >
    //             <input type="text" name="username" {...register("username")} placeholder="Username" />
    //             <input type="email" name="email"  {...register("email")} placeholder="Email" />
    //             <input
    //                 type="new-password"
    //                 name="password"
    //                 {...register("password", {
    //                     required: true,
    //                     minLength: 8,
    //                     maxLength: 16
    //                 })}
    //                 placeholder="Password" />
    //             {errors.password && errors.password?.type === "required" && <p>Password is required</p>}
    //             {errors.password && errors.password?.type === "minLength" && <p>Password must be at least 8 characters</p>}
    //             {errors.password && errors.password?.type === "maxLength" && <p>Password must be at max 16 characters</p>}
    //             <input type="password" name="confirmPassword"  {...register("confirmPassword", {
    //                 required: true,
    //             })} placeholder="Confirm Password" />
    //             {errors.confirmPassword && errors.confirmPassword?.type === "required" && <p>Confirm Password is required</p>}

    //             <div className="g-recaptcha" data-sitekey="6Lf1nvogAAAAAIaqsPlXKyoSnwo"></div>
    //             <button className="btn">Sign in</button>
    //         </form>
    //     </div>
    // );
    return (

        <Container component="main" maxWidth="xs">
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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstname"
                                required
                                fullWidth
                                id="firstname"
                                label="First Name"
                                autoFocus />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastname"
                                label="Last Name"
                                name="lastname"
                                autoComplete="family-name"
                            />
                        </Grid>

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

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="c_password"
                                label="Confirm Password"
                                type="password"
                                id="c_password"
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>

                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </Container>
    )

};

export default Registration;