
import config from '../../config';
import modeliseOrders from '../modeliseOrders';

const getCoinbaseOrders = async (userData) => {

  const data = {
    email: userData.email,
    exchange: 'coinbase'
  };

  const response = await fetch('http://' + config.urlServer + '/coinbase/orders', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userData.token
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  let res = await response.json();

  res = modeliseOrders(res, 'coinbase')
  return res;

}


export default getCoinbaseOrders