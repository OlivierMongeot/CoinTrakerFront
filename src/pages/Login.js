import React from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import '../styles/components/_login.scss';

import AuthenticationService from '../helpers/AuthService';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        
        console.log(data);

        AuthenticationService.login(data.name, data.password)
            .then(isAuthenticated => {
                if (!isAuthenticated) {
                   
                    console.log('🔐 Identifiant ou mot de passe incorrect.');
                    return;
                } else {
         
                    console.log('🔐 Vous êtes connecté.');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                }


            });

        // axios.post('/login', data)
        //     .then(res => {
        //         console.log(res.data);
        //         console.log(res.data.token);
        //         // set token in localStorage
        //         const user = {
        //             name: res.data.data.name,
        //             id: res.data.data.id,
        //             token: res.data.token,
        //             exchange: {}
        //         };
        //         localStorage.setItem('user', JSON.stringify(user));
        //     }
        //     )   
        //     .catch(err => {
        //         console.log(err.response.data.error);
        //     }
        //     );
    }

    return (
        <div className="app-container">
            <header>
                <Navbar />
            </header>
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <input type="text" name="name" {...register("name")} placeholder="Name" />
                    <input type="password" name="password"  {...register("password", {
                        required: true
                    })} placeholder="Password" />
                    {errors.password && errors.password?.type === "required" && <p>Password is required</p>}
                    <button className="btn">Sign in</button>
                </form>
            </div>
        </div>


    );
};

export default Login;