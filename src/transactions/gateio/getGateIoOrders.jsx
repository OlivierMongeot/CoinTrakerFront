import config from '../../config';

import modeliseOrders from '../modeliseOrders';


const getOrders = async (userData) => {

  const data = {
    email: userData.email,
    exchange: 'gateio'
  };

  const response = await fetch('http://' + config.urlServer + '/gateio/orders', {
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
  res = modeliseOrders(res, 'gateio')
  return res

}


export default getOrders