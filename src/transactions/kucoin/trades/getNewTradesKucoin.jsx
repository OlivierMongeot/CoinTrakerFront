import config from '../../../config';
import { toast } from 'react-toastify';
import addUrlImage from '../../../helpers/addUrlImage'
import getHumanDateTime from '../../../helpers/getHumanDate';
import getStartTime from '../../getStartTime';
import saveNewTransactions from '../../saveNewTransactionsDB';
import setTimeTable from '../../setTimeTable';
import getQuote from '../../getQuoteHistory';
import rebuildKucoinData from '../rebuildKucoinData';


const getNewTrades = async (userData, reset) => {

  // console.log('____START TRADE KUCOIN____');

  let newTrades = [];

  let start = await getStartTime(userData, 'kucoin', 'trade')

  const oneWeek = 604800000;
  // const sevenDayPeriode = 52;
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
    // saveLastTimeChecked('kucoin', 'trade', start + oneWeek, userData);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      console.log('Trx found on 7 days ', trx.data.data.items);
    }
    return trx.data.data;
  }


  if (start < now && start !== undefined) {
    console.log('Start fetch TRADE for ', getHumanDateTime(start) + ' to ' + getHumanDateTime(start + oneWeek));
    try {
      const data = await fetchTransactionsKucoin(start);
      if (data.items) {
        newTrades = newTrades.concat(data.items);
      } else {
        console.log(data)
      }
    } catch (error) {
      toast('error.error');
      console.log('error catched :', error);
    }
    await delay(500);

  } else {
    console.log('Time recherched > now or undefined : STOP Logical error');
    return [[], 'stop'];
  }

  if (newTrades.length > 0) {
    newTrades = await addUrlImage(newTrades, 'kucoin', 'transactions')
    newTrades = await rebuildKucoinData(newTrades, 'trade')
    newTrades = await getQuote(newTrades)
    console.log('New Trades Kucoin ', newTrades);
    saveNewTransactions(newTrades, userData)
  }

  if (start + oneWeek > Date.now()) {
    console.log('STOP time + oneWeek > now ')
    await setTimeTable('kucoin', 'trade', Date.now(), userData);
    return [newTrades, 'stop']
  } else {
    console.log('continue time + oneWeek < now ')
    await setTimeTable('kucoin', 'trade', start + oneWeek, userData);
    return [newTrades, 'continue']
  }
}

export default getNewTrades;