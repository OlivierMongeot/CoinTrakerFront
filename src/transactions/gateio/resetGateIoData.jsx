import axios from 'axios';
import config from '../../config';

const resetGateioData = async (exchange = 'gateio', userData, typeTransaction = 'all') => {

  let baseUrl = "http://" + config.urlServer;

  const data = {
    id: userData.id,
    email: userData.email,
    exchange: exchange,
    typeTransaction: typeTransaction,
  };

  let response = await axios.post(baseUrl + '/gateio/reset-data-transaction', data,
    { headers: { 'authorization': userData.token } }
  );

  console.log(response)
}
export default resetGateioData