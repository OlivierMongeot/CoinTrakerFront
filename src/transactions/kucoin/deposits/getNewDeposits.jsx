
import addUrlImage from '../../../helpers/addUrlImage'
import getQuote from '../../getQuoteHistory';

import getHumanDateTime from '../../../helpers/getHumanDate';
import config from '../../../config';

// import getTimeTable from '../../transactions/getTimeTable';
import getStartTime from '../../getStartTime';
import saveNewTransactions from '../../saveNewTransactionsDB';
import setTimeTable from '../../setTimeTable';
import rebuildKucoinData from '../rebuildKucoinData';


const getNewDeposits = async (userData) => {

  let start = null

  // start = 1640908800000
  start = await getStartTime(userData, 'kucoin', 'deposit')

  let newDeposits = [];

  const oneWeek = 604800000;

  const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
  const now = Date.now();

  async function fetchDepositsKucoin(start) {

    const data = {
      email: userData.email,
      exchange: 'kucoin',
      start: start,
      end: start + oneWeek
    };

    const response = await fetch('http://' + config.urlServer + '/kucoin/deposits', {
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
      console.log('Deposit find : ', trx.data.data.items.length);
    }
    // console.log('DATA on data ', trx.data.data);
    return trx.data.data;
  }


  if (start < now) {
    console.log('Start fetch DEPOSIT for this time : ', getHumanDateTime(start));
    try {
      const data = await fetchDepositsKucoin(start);
      if (data.items) {
        newDeposits = newDeposits.concat(data.items);
      }
    } catch (error) {
      console.log('error catched :', error);
    }
    await delay(300);

  } else {
    console.log('error');
    return [[], 'stop'];
  }


  if (newDeposits.length > 0) {
    newDeposits = await addUrlImage(newDeposits, 'kucoin', 'deposits')
    newDeposits = await rebuildKucoinData(newDeposits, 'deposits')
    newDeposits = await getQuote(newDeposits)
    console.log('SAVE DEPOSITS IN DB')
    saveNewTransactions(newDeposits, userData)
  }

  if (start + oneWeek > Date.now()) {
    console.log('STOP time + oneWeek > now ')
    await setTimeTable('kucoin', 'deposits', Date.now(), userData);
    return [newDeposits, 'stop', start]
  } else {
    console.log('continue time + oneWeek < now ')
    await setTimeTable('kucoin', 'deposits', start + oneWeek, userData);
    return [newDeposits, 'continue', start + oneWeek]
  }
}

export default getNewDeposits