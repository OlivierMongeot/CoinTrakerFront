import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import SignUp from '../components/SignUp';

const Registration = () => {


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
        <SignUp>
        </SignUp>
    )

};

export default Registration;