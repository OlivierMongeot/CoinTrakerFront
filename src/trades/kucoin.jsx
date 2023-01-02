
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';

const proccesTradesKucoin = async (mode, userData) => {

  console.log('____Start fetch TRADE Kucoin____');

  const savedTrxKucoin = JSON.parse(localStorage.getItem('transactions-kucoin'));

  const rebuildDataKucoin = (trades) => {
    console.log('Rebuild kucoin TRADE')
    trades.forEach(element => {

      element.title = 'ID : ' + element.tradeId + '| Market type : ' + element.type;
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
    return trades;
  }

  let start = null;

  if (savedTrxKucoin && savedTrxKucoin.length > 0 && mode === 'no-update') {

    console.log('No update');
    return savedTrxKucoin;

  } else if (savedTrxKucoin && savedTrxKucoin.length > 0 && mode === 'start') {
    // console.log('Start from last trx')
    // const lastTransactionKucoin = savedTrxKucoin.reduce((r, o) => new Date(o.createdAt) > new Date(r.createdAt) ? o : r);
    // console.log(lastTransactionKucoin)
    // start = lastTransactionKucoin.createdAt + 1;
    const timeTable = JSON.parse(localStorage.getItem('time-table'))
    // console.log('timeTable', timeTable);
    start = timeTable?.kucoin.trade ? timeTable.kucoin.trade : 1640908800000;
  } else {
    console.log('no data : fetch trx from 01/01/22')
    start = 1640908800000;// 1/1/22
  }


  // 1640908800000  1/1/22
  // const start = 1645776000000; // fev 22 
  const oneWeek = 604800000;
  const sevenDayPeriode = 54;
  const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
  let newTrades = [];
  let allTrades = []
  const now = Date.now();

  async function fetchTransactionsKucoin(start) {

    const data = {
      email: userData.email,
      exchange: 'kucoin',
      start: start,
      end: start + oneWeek
    };


    const response = await fetch('http://' + config.urlServer + '/kucoin/fills', {
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
      console.log('Start check TRADE for this time + 7d:', getHumanDateTime(time));
      try {
        const data = await fetchTransactionsKucoin(time);
        if (data.items) {
          newTrades = newTrades.concat(data.items);
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
      console.log('Time recherched > now : STOP');
      saveLastTimeChecked('kucoin', 'trade', time - oneWeek);
      break;
    }

  }
  console.log('NEW Trades', newTrades)

  if (newTrades.length > 0) {
    newTrades = await addUrlImage(newTrades, 'kucoin', 'transactions')
    newTrades = await rebuildDataKucoin(newTrades)
  }
  console.log('New Trades ', newTrades);
  return newTrades;
}

export default proccesTradesKucoin;