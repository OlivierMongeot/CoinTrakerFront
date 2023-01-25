import axios from 'axios';
import config from '../config';

const getTimeTable = async (userData) => {

  let baseUrl = "http://" + config.urlServer + '/get-time-table';

  const data = {
    email: userData.email,
  };

  let response = await axios.post(baseUrl, data,
    {
      headers: {
        'authorization': userData.token
      }
    }
  );
  return response.data

}
export default getTimeTable