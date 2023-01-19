import config from "../config";


const updateTransactionDB = async (idTransaction, quotation, userData) => {

  const data = {
    email: userData.email,
    id_transaction: idTransaction,
    quotation: quotation
  };

  let baseUrl = "http://" + config.urlServer;

  const response = await fetch(baseUrl + '/update-transactions', {
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
  const result = await response.json();
  console.log('End update trx quote : ', result)


}

export default updateTransactionDB