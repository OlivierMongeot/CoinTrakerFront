import axios from 'axios';


const jwsTester = async () => {
  let url = "http://192.168.0.46:4000/jwt";
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