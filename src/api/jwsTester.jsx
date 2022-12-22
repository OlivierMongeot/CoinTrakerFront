import axios from 'axios';
import config from '../config';


const jwsTester = async () => {
  let url = "http://" + config.urlServer + "/jwt";
  let user = JSON.parse(localStorage.getItem('user'));
  let jwt = user.token;
  // console.log('jwtTester token recup in storage Local', jwt);

  let response = await axios.get(url,
    {
      headers: {
        'authorization': jwt
      }
    }
  );
  console.log('jwsTester response API ', response.data);
  return;
}

export default jwsTester;