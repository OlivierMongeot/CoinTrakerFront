import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import saveLastTimeChecked from '../helpers/saveLastTimeChecked'
import getHumanDateTime from '../helpers/getHumanDate';
import getFiatValue from '../helpers/getFiatValue';
import eraseDoublon from '../helpers/eraseDoublon';
import getSimpleDate from '../helpers/getSimpleDate';

const depositKucoin = async (mode, userData) => {

  console.log('----------START DEPOSITS KUCOIN ---------------')

  const rebuildDataKucoin = async (deposits) => {
    console.log('rebuild Deposit kucoin')

    let index = 0;
    while (index < deposits.length) {
      deposits[index].title = 'Address deposit : ' + deposits[index].address;
      deposits[index].exchange = 'kucoin'
      deposits[index].id = deposits[index].walletTxId;
      deposits[index].smartType = 'Blockchain : ' + deposits[index].chain.toUpperCase();
      deposits[index].updated_at = new Date(deposits[index].createdAt)

      deposits[index].entry = {
        amount: deposits[index].amount,
        currency: deposits[index].currency,
        urlLogo: deposits[index].urlLogo
      }
      deposits[index].exit = {
        amount: 0,
        currency: ''
      }

      deposits[index].native_amount = { amount: deposits[index].amount, currency: deposits[index].currency };
      deposits[index].transaction = (deposits[index]?.remark).toLowerCase();

      index++
    }
    return deposits;
  }

  let start = null;
  let newDeposits = [];
  let allDeposits = []

  const allTransactions = JSON.parse(localStorage.getItem('transactions-all'))
  let savedDepositsKucoin = allTransactions.filter(transaction => {
    return transaction.exchange === 'kucoin' && transaction.transaction === 'deposit'
  })
  console.log('Deposit kucoin saved ', savedDepositsKucoin);


  if (savedDepositsKucoin && savedDepositsKucoin.length > 0 && mode === 'no-update') {
    return savedDepositsKucoin;

  } else if (savedDepositsKucoin && savedDepositsKucoin.length > 0 && mode === 'start') {
    console.log('start from last deposit') // to do last deposit ceck 
    const timeTable = JSON.parse(localStorage.getItem('time-table'))
    start = timeTable?.kucoin.deposit ? timeTable.kucoin.deposit : 1640908800000

  } else {
    console.log('No data deposits : fetch deposit from 01/01/22')
    start = 1640908800000;// 1/1/22
    savedDepositsKucoin = []
  }

  // 1640908800000  1/1/22
  const oneWeek = 604800000;
  const sevenDayPeriode = 54;
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
    saveLastTimeChecked('kucoin', 'deposit', start + oneWeek);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      // console.log(getHumanDateTime(start))
      console.log('Deposit found on 7 days ', trx.data.data.items);
      console.log('Deposit lenght ', trx.data.data.items.length);
    }
    // console.log('DATA on data ', trx.data.data);
    return trx.data.data;
  }


  let index = 0;
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

      } catch (error) {
        toast('error.error');
        console.log('error catched :', error);
      }
      await delay(300);

    } else {
      saveLastTimeChecked('kucoin', 'deposit', time - oneWeek);
      console.log('Time recherched > now');
      break;
    }
  }
  // let newDeposits = []
  console.log('NEW deposit', newDeposits)
  if (newDeposits.length > 0) {
    newDeposits = await addUrlImage(newDeposits, 'kucoin', 'deposit')
    newDeposits = await rebuildDataKucoin(newDeposits)
  }

  allDeposits = [...newDeposits, ...savedDepositsKucoin]
  // allDeposits = await rebuildDataKucoin(allDeposits)

  console.log('All Kucoin Deposits', allDeposits.length);

  allDeposits = eraseDoublon(allDeposits)
  // allDeposits = await rebuildDataKucoin(allDeposits)
  // localStorage.setItem('deposits-kucoin', JSON.stringify(allDeposits));
  return allDeposits
  // return newDeposits;
}

export default depositKucoin;