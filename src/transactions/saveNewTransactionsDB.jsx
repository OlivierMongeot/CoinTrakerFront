import config from '../config';

const saveNewTransactions = async (transactions: [], userData: []): void => {
  console.log('Save in DB')
  let baseUrl = "http://" + config.urlServer;


  // Separae les envois si il y a + 5 transactions
  if (transactions.length > 5) {
    console.log('DATA > 5 : split the data not work for the momment')
  }

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