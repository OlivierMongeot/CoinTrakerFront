
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'

const proccesTransactionKucoin = async (mode, userData) => {

  const savedTrxKucoin = JSON.parse(localStorage.getItem('transactions-kucoin'));

  const rebuildDataKucoin = (transactions) => {
    console.log('rebuild kucoin')
    transactions.forEach(element => {

      element.title = 'ID : ' + element.id + '| Market type : ' + element.type;
      element.exchange = 'kucoin'
      element.id = element.tradeId;
      element.amount = element.size;
      element.smartType = element?.type + ' ' + element?.side;
      element.updated_at = new Date(element.createdAt)
      element.token = element.symbol;

      let currencyTab = element.symbol.split('-');

      if (element.side === "buy") {

        element.entry = {
          amount: element.size,
          currency: currencyTab[0],
          urlLogo: element.urlLogo
        }
        element.exit = {
          amount: element.funds,
          currency: currencyTab[1],
          urlLogo: ''
        }
        element.native_amount = { amount: element.funds, currency: currencyTab[1] };
        element.currency = currencyTab[0];
        element.transaction = 'trade';
      } else {
        element.entry = {
          amount: element.funds,
          currency: currencyTab[1],
          urlLogo: ''
        }
        element.exit = {
          amount: element.size,
          currency: currencyTab[0],
          urlLogo: element.urlLogo
        }
        element.transaction = 'trade'
        element.native_amount = { amount: element.funds, currency: currencyTab[1] }
        element.currency = currencyTab[0]
      }
    })
    return transactions;
  }

  if (savedTrxKucoin.length > 0 && mode === 'start') {
    return savedTrxKucoin;
  }
  const start = 1645776000000; // fev 22 
  const oneWeek = 604800000;
  const sevenDayPeriode = 20;
  const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
  let transactions = [];
  const now = Date.now();

  async function fetchTransactionsKucoin(start) {

    const data = {
      email: userData.email,
      exchange: 'kucoin',
      start: start,
      end: start + oneWeek
    };


    const response = await fetch('http://' + config.urlServer + '/kucoin/orders', {
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
    const trx = await response.json();
    // console.log('DATA on data ', trx);
    if (trx.error) {
      console.log(' error catched here');
      throw new Error(trx.error.message);
    }
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      // console.log(getHumanDateTime(start))
      console.log('Trx found on 7 days ', trx.data.data.items);
      console.log('Trx lenght ', trx.data.data.items.length);
    }
    // console.log('DATA on data ', trx.data.data);
    return trx.data.data;
  }

  let index = 0;
  while (index < sevenDayPeriode) {

    let time = start + (oneWeek * index)
    if (time < now) {
      console.log('check trx for this time + 7d:', time);
      try {
        const data = await fetchTransactionsKucoin(time);
        if (data.items) {
          transactions = transactions.concat(data.items);
        } else {
          console.log(data)
        }

      } catch (error) {
        toast('error.error');
        console.log('error catched :', error);
      }
      await delay(300);
      index++;
    } else {
      console.log('Time recherched > now');
      break;
    }

  }

  let res = await addUrlImage(transactions, 'kucoin')
  res = await rebuildDataKucoin(transactions)

  console.log('res parsed', res);
  localStorage.setItem('transactions-kucoin', JSON.stringify(res));
  return res;
}

export default proccesTransactionKucoin;