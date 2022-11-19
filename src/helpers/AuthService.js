
import axios from 'axios';


export default class AuthenticationService {

    static isAuthenticated = false;
  
    static login(username, password) {

    let data = {
        name: username,
        password: password
    }

    return new Promise(resolve => {
      
        axios.post('/login', data)
            .then(res => {
                if(res.data.token){
                     console.log(res.data);
                    console.log(res.data.token);
                    // set token in localStorage
                    const user = {
                    name: res.data.data.name,
                    id: res.data.data.id,
                    token: res.data.token,
                    exchange: {}
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
                console.log(err.response.data.error);
                this.isAuthenticated = false;
                resolve(false);
            }
            );
    }
    );
    }
}
    //   });

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
    //         this.isAuthenticated = true;
    //         return true;
    //     }
    //     )
    //     .catch(err => {
    //         console.log(err.response.data.error);
    //         this.isAuthenticated = false;
    //         return false;
    //     }
    //     );


    // }
//   }