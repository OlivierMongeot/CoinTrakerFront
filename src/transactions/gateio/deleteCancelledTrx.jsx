import axios from 'axios';
import config from '../../config';


const helpersDB = async (userData) => {

  let baseUrl = "http://" + config.urlServer;

  const data = {
    email: userData.email,
    // exchange: 'gateio',
    // status: 'cancelled',
  };

  let response = await axios.post(baseUrl + '/helpersDB', data,
    { headers: { 'authorization': userData.token } }
  );

  console.log(response)





}

export default helpersDB