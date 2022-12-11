
import axios from 'axios';


export default class AuthenticationService {

    static isAuthenticated = false;

    static login(email, password) {
        let data = {
            email: email,
            password: password
        }

        return new Promise(resolve => {

            let url = "http://192.168.0.46:4000";
            console.log('url', url);
            axios.post(url + '/login', data)
                .then(res => {
                    if (res.data.token) {
                        console.log(res.data);
                        // console.log(res.data.token);
                        // set token in localStorage
                        const user = {
                            lastname: res.data.data.lastname,
                            email: res.data.data.email,
                            id: res.data.data.id,
                            token: res.data.token,
                            exchanges: res.data.exchanges,
                            roles: res.data.roles
                        };
                        localStorage.setItem('user', JSON.stringify(user));
                        this.isAuthenticated = true;
                        resolve(true);
                    } else {
                        this.isAuthenticated = false;
                        resolve(false);
                    }
                }
                )
                .catch(err => {
                    console.log('error: ', err.response.data.error);
                    this.isAuthenticated = false;
                    resolve(false);
                }
                );
        }
        );
    }
}