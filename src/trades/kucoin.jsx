
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';

import getSimpleDate from '../helpers/getSimpleDate';
import eraseDoublon from '../helpers/eraseDoublon';


const proccesTradesKucoin = async (mode, userData) => {

  console.log('____Start fetch TRADE Kucoin____');

  // let savedTradeKucoin = JSON.parse(localStorage.getItem('trades-kucoin'));

  const allTransactions = JSON.parse(localStorage.getItem('transactions-all'))
  let savedTradeKucoin = allTransactions.filter(transaction => {
    return transaction.exchange === 'kucoin' && transaction.transaction === 'trade'
  })


  const rebuildDataKucoin = async (trades) => {
    console.log('Rebuild kucoin TRADE', trades)

    let index = 0;

    while (index < trades.length) {

      trades[index].title = 'ID : ' + trades[index].tradeId + '| Market type : ' + trades[index].type;
      trades[index].exchange = 'kucoin'
      trades[index].id = trades[index].tradeId;

      trades[index].smartType = trades[index]?.type + ' ' + trades[index]?.side;
      trades[index].updated_at = new Date(trades[index].createdAt)


      let currencyTab = trades[index].symbol.split('-');

      if (trades[index].side === "buy") {

        trades[index].entry = {
          amount: trades[index].size,
          currency: currencyTab[0],
          urlLogo: trades[index].urlLogo
        }
        trades[index].exit = {
          amount: trades[index].funds,
          currency: currencyTab[1],
          urlLogo: ''
        }
        trades[index].native_amount = { amount: trades[index].funds, currency: currencyTab[1] };
        trades[index].currency = currencyTab[0];
        trades[index].transaction = 'trade';


      } else {
        trades[index].entry = {
          amount: trades[index].funds,
          currency: currencyTab[1],
          urlLogo: ''
        }
        trades[index].exit = {
          amount: trades[index].size,
          currency: currencyTab[0],
          urlLogo: trades[index].urlLogo
        }
        trades[index].transaction = 'trade'
        trades[index].native_amount = { amount: trades[index].funds, currency: currencyTab[1] }
        trades[index].currency = currencyTab[0]

      }

      trades[index].date = getSimpleDate(trades[index].createdAt)
      // trades[index].quoteUSD = null

      index++;
    }

    return trades;
  }

  let start = null;
  let allTrades = [];
  let newTrades = [];
  const timeTable = JSON.parse(localStorage.getItem('time-table'))
  if (savedTradeKucoin && savedTradeKucoin.length > 0 && mode === 'no-update') {

    console.log('No update');
    return savedTradeKucoin;

  } else if (savedTradeKucoin && savedTradeKucoin.length > 0 && mode === 'start') {
    console.log('Start from last trx')

    start = timeTable?.kucoin.trade ? timeTable.kucoin.trade : 1640908800000;
  } else {
    console.log('no data : fetch trx from 01/01/22')
    start = 1640908800000;
    savedTradeKucoin = [];
  }


  const oneWeek = 604800000;
  const sevenDayPeriode = 10;
  const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

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
    if (trx.error) {
      console.log(' error catched here');
      throw new Error(trx.error.message);
    }
    saveLastTimeChecked('kucoin', 'trade', start + oneWeek);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      console.log('Trx found on 7 days ', trx.data.data.items);
    }
    return trx.data.data;
  }


  let index = 0;
  let time = null;
  while (index < sevenDayPeriode) {

    time = start + (oneWeek * index)
    // console.log('time', time)
    // console.log('start', getHumanDateTime(time))
    if (time < now) {
      console.log('Start fetch TRADE for ', getHumanDateTime(time) + ' to ' + getHumanDateTime(time + oneWeek));
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


  if (newTrades.length > 0) {
    newTrades = await addUrlImage(newTrades, 'kucoin', 'transactions')
    newTrades = await rebuildDataKucoin(newTrades)
    console.log('New Trades Kucoin ', newTrades);
  }
  // ajout provosoire pour rebuilder
  allTrades = [...newTrades, ...savedTradeKucoin]
  allTrades = eraseDoublon(allTrades) // au cas ou 


  return allTrades;
}

export default proccesTradesKucoin;