import config from '../../../config';
import addUrlImage from '../../../helpers/addUrlImage';
import getHumanDateTime from '../../../helpers/getHumanDate';
import fetchQuote from '../../getQuoteHistory';
import saveNewTransactions from '../../saveNewTransactionsDB';
import getStartTime from '../../getStartTime';
import setTimeTable from '../../setTimeTable';
import rebuildKucoinData from '../rebuildKucoinData';

const getNewWithdrawals = async (userData, reset) => {

  let start = await getStartTime(userData, 'kucoin', 'withdrawals')

  let newWithdrawals = [];

  const oneWeek = 604800000;

  const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
  const now = Date.now();

  async function fetchWithdrawalsKucoin(start) {

    const data = {
      email: userData.email,
      exchange: 'kucoin',
      start: start,
      end: start + oneWeek
    };

    const response = await fetch('http://' + config.urlServer + '/kucoin/withdrawals', {
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
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      console.log('Withdrawals find ', trx.data.data.items.length);
    }
    return trx.data.data;
  }


  if (start < now) {
    console.log('Start to fetch WITHDRAWALS for this time : ', getHumanDateTime(start));
    try {
      const data = await fetchWithdrawalsKucoin(start);
      if (data.items) {
        // const result = data.items;
        // if (result.length === 0) {

        // } else {
        //   console.log('New withdrawals : ', result.length)
        // }
        newWithdrawals = newWithdrawals.concat(data.items);
      } else {
        console.log('result raw', data)
      }
    } catch (error) {
      console.log('error catched :', error);
      return false;
    }
    await delay(400);

  } else {
    console.log('error');
    return [[], 'stop'];
  }

  // console.log('NEW withdrawals', newWithdrawals)

  if (newWithdrawals.length > 0) {
    newWithdrawals = await addUrlImage(newWithdrawals, 'kucoin', 'withdrawals');
    newWithdrawals = await rebuildKucoinData(newWithdrawals, 'withdrawals')
    newWithdrawals = await fetchQuote(newWithdrawals)
    saveNewTransactions(newWithdrawals, userData)
  }

  if (start + oneWeek > Date.now()) {
    console.log('STOP time + oneWeek > now ')
    await setTimeTable('kucoin', 'withdrawals', Date.now(), userData);
    return [newWithdrawals, 'stop']
  } else {
    await setTimeTable('kucoin', 'withdrawals', start + oneWeek, userData);
    console.log('CONTINUE : time + oneWeek < now ')
    return [newWithdrawals, 'continue']
  }
}

export default getNewWithdrawals;