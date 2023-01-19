
import addUrlImage from '../../src/helpers/addUrlImage'
import rebuildDepositKucoin from './rebuildDepositKucoin';
import fetchQuote from './fetchQuote';
import saveLastTimeChecked from '../../src/transactions/setTimeTable'
import getHumanDateTime from '../../src/helpers/getHumanDate';
import config from '../../src/config';
import saveNewDeposit from './saveNewDeposits';
import getTimeTable from '../../src/transactions/getTimeTable';


const getNewDeposits = async (userData, reset) => {

  console.log('Start Fetch New Deposit')

  const timeTable = JSON.parse(localStorage.getItem('time-table'))
  let start = timeTable?.kucoin.deposit ? timeTable.kucoin.deposit : 1640908800000

  // Get TImeTable friom DB
  let currentTimesTable = await getTimeTable(userData)
  console.log('CurrentTimesTable from DB', currentTimesTable)
  if (currentTimesTable === '') {
    // resetCurrentTimeTable()
  }



  let newDeposits = [];

  const oneWeek = 604800000;
  const sevenDayPeriode = 10;
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
    // saveLastTimeChecked('kucoin', 'deposit', start + oneWeek, userData);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      // console.log(getHumanDateTime(start))
      console.log('Deposit found ', trx.data.data.items);
      console.log('Deposit lenght ', trx.data.data.items.length);
    }
    // console.log('DATA on data ', trx.data.data);
    return trx.data.data;
  }

  let index = 0;
  let lastTimeChecked = null

  while (index < sevenDayPeriode) {
    // console.log('index', index);
    let time = start + (oneWeek * index)
    index++;
    if (time < now) {
      console.log('Start fetch DEPOSIT for this time : ', getHumanDateTime(time));
      try {
        const data = await fetchDepositsKucoin(time);
        if (data.items) {
          newDeposits = newDeposits.concat(data.items);
        } else {
          console.log('result raw', data)
        }
        lastTimeChecked = time
      } catch (error) {
        console.log('error catched :', error);
      }
      await delay(300);

    } else {
      saveLastTimeChecked('kucoin', 'deposit', time - oneWeek, userData);
      console.log('Time recherched > now');
      return [];
    }

  }

  saveLastTimeChecked('kucoin', 'deposit', lastTimeChecked + oneWeek, userData);
  // let newDeposits = []
  console.log('New deposit', newDeposits)


  if (newDeposits.length > 0) {
    newDeposits = await addUrlImage(newDeposits, 'kucoin', 'deposit')
    newDeposits = await rebuildDepositKucoin(newDeposits)
    newDeposits = await fetchQuote(newDeposits)
    // save in DB 
    saveNewDeposit(newDeposits, userData)
  }

  return newDeposits
}


export default getNewDeposits