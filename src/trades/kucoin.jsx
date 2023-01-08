
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';
import getFiatValue from '../helpers/getFiatValue';
import getSimpleDate from '../helpers/getSimpleDate';
import eraseDoublon from '../helpers/eraseDoublon';


const proccesTradesKucoin = async (mode, userData) => {

  console.log('____Start fetch TRADE Kucoin____');

  let savedTradeKucoin = JSON.parse(localStorage.getItem('trades-kucoin'));

  const rebuildDataKucoin = async (trades) => {
    console.log('Rebuild kucoin TRADE', trades)

    let index = 0;
    // while (index < 10) {
    while (index < trades.length) {

      trades[index].title = 'ID : ' + trades[index].tradeId + '| Market type : ' + trades[index].type;
      trades[index].exchange = 'kucoin'
      trades[index].id = trades[index].tradeId;
      trades[index].amount = trades[index].size;
      trades[index].smartType = trades[index]?.type + ' ' + trades[index]?.side;
      trades[index].updated_at = new Date(trades[index].createdAt)
      trades[index].token = trades[index].symbol;

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

        trades[index].quote_transaction = {
          amount: trades[index].funds,
          // devises: await getFiatValue(trades[index].exit.currency, trades[index].createdAt),
          devises: { usd: 1 },
          // currency: trades[index].exit.currency,
          currency: 'usd',
          diplayedFiat: 'usd',
          from: trades[index].entry.currency
        };


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

        trades[index].quote_transaction = {
          amount: trades[index].funds,
          devises: { devises: { usd: null } },
          currency: 'usd',
          diplayedFiat: 'usd',
          from: trades[index].entry.currency
        };
      }

      trades[index].date = getSimpleDate(trades[index].createdAt)
      trades[index].quoteUSD = null

      index++;
    }
    // Fetch historic price  
    let tabToken = [];
    trades.forEach(element => {
      let token = element.symbol.split('-');
      tabToken.push({ token: token[1], date: element.date })
    });
    console.log('tabtoken', tabToken);

    const unique = (a, fn) => {
      if (a.length === 0 || a.length === 1 || !fn) {
        return a;
      }
      for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j < a.length; j++) {
          if (fn(a[i], a[j])) {
            a.splice(i, 1);
          }
        }
      }
      return a;
    }

    let uniqueMembers = unique(tabToken, (a, b) => (a.token === b.token) && (a.date === b.date));
    let uniqueTokens = unique(uniqueMembers, (a, b) => (a.token === b.token) && (a.date === b.date))
    // console.log(uniqueMembers);
    let id = 0
    while (id < uniqueTokens.length) {

      console.log('getFiatValue for ', uniqueTokens[id])

      uniqueTokens[id].devises =
        await getFiatValue(
          uniqueTokens[id].token,
          uniqueTokens[id].date
        )
      id++
    }

    console.log('unique Tokens', uniqueTokens);


    trades.forEach(trade => {

      // let token = null;
      // let dateWanted = null;
      let devises = null;

      switch (trade.side) {
        case 'sell':
          // token = trade.entry.currency;
          // dateWanted = trade.date;
          devises = uniqueTokens.filter(element => {
            return (element.token === trade.entry.currency && element.date === trade.date);
          })
          trade.quote_transaction.devises = devises[0].devises;
          break;

        case 'buy':
          // token = trade.exit.currency;
          // dateWanted = trade.date;
          devises = uniqueTokens.filter(element => {
            return (element.token === trade.exit.currency && element.date === trade.date);
          })
          trade.quote_transaction.devises = devises[0].devises;
          break;
        default:
          break;
      }

    });

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
    start = timeTable?.kucoin.trade ? timeTable.kucoin.trade : 1640908800000;
    savedTradeKucoin = [];
  }

  // 1640908800000  1/1/22
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
    // console.log('DATA on data ', trx);
    if (trx.error) {
      console.log(' error catched here');
      throw new Error(trx.error.message);
    }
    saveLastTimeChecked('kucoin', 'trade', start + oneWeek);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      // console.log(getHumanDateTime(start))
      console.log('Trx found on 7 days ', trx.data.data.items);
      console.log('Trx lenght ', trx.data.data.items.length);
    }
    // console.log('DATA on data ', trx.data.data);
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
      console.log('Time recherched > now : STOP', getHumanDateTime(time));
      saveLastTimeChecked('kucoin', 'trade', time - oneWeek);
      break;
    }
  }
  console.log('NEW Trades', newTrades)
  // if (newTrades.length === 0) {

  // }


  if (newTrades.length > 0) {
    newTrades = await addUrlImage(newTrades, 'kucoin', 'transactions')
    newTrades = await rebuildDataKucoin(newTrades)
  }
  // ajout provosoire pour rebuilder
  allTrades = [...newTrades, ...savedTradeKucoin]
  allTrades = eraseDoublon(allTrades) // au cas ou 
  // console.log('All Trades ', allTrades);

  localStorage.setItem('trades-kucoin', JSON.stringify(allTrades));
  console.log('New Trades Kucoin ', newTrades);
  return allTrades;
}

export default proccesTradesKucoin;