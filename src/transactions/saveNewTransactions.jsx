import config from '../config';

const saveNewTransactions = async (transactions, userData) => {

  let baseUrl = "http://" + config.urlServer;

  const data = {
    email: userData.email,
    data: transactions,
  };

  const response = await fetch(baseUrl + '/set-transactions', {
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
  const transac = await response.json();
  console.log('End save new trx : ', transac);
}

export default saveNewTransactions