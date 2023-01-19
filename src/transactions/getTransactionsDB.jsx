// import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import config from '../config';


const getTransactionsDB = async (user, type, exchange) => {

  console.log('-- GET TRX in Database ' + exchange + ' -- ' + type + ' --')

  const data = JSON.stringify({
    userId: user.id,
    email: user.email,
    type: type,
    exchange
  });

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