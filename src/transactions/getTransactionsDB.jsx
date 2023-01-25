// import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import config from '../config';


const getTransactionsDB = async (user, type, exchange) => {

  console.log('-- GET TRX in Database ' + exchange + ' -- ' + type + ' --')

  const data = JSON.stringify({
    id: user.id,
    email: user.email,
    type: type,
    exchange
  });

  console.log('data send for DB trx ', data)
  console.log('user', user)

  let url = "http://" + config.urlServer + "/get-transactions";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      },
      body: data
    })
    const result = await response.json();

    if (!result) {
      console.log(result);
      throw new Error('no data : check token pls ');
    }
    let savedTradesKucoin = result.transactions;

    if (savedTradesKucoin === undefined || !savedTradesKucoin.length > 0) {
      savedTradesKucoin = [];
    }
    return savedTradesKucoin

  } catch (error) {
    toast('Erreur ' + error.message)
    console.log('catch error', error);

    throw new Error("HTTP error " + error.message);
  }



}

export default getTransactionsDB;