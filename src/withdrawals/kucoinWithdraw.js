import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import getFiatValue from '../helpers/getFiatValue';
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';

const withdrawalsKucoin = async (mode, userData) => {

  console.log('----------START WITHDRAWALS FETCH---------------')

  let savedWithdrawalsKucoin = JSON.parse(localStorage.getItem('withdrawals-kucoin'));

  console.log('Withdrawals kucoin saved ', savedWithdrawalsKucoin);

  const rebuildDataKucoin = (withdrawals) => {
    console.log('rebuild Withdraw kucoin')
    withdrawals.forEach(element => {

      element.title = 'Address withdrawals : ' + element.address;
      element.exchange = 'kucoin'
      element.id = element.walletTxId;
      element.smartType = 'Blockchain : ' + element.chain.toUpperCase();
      element.updated_at = new Date(element.createdAt)
      element.token = element.currency;

      let currencyTab = element.currency;

      element.exit = {
        amount: element.amount,
        currency: currencyTab,
        urlLogo: element.urlLogo
      }
      element.entry = {
        amount: 0,
        currency: ''

      }
      // element.native_amount = { amount: element.amount, currency: currencyTab };
      element.native_amount = getFiatValue(element.amount, currencyTab);
      element.transaction = 'withdrawals'

    })
    return withdrawals;
  }

  let start = null;
  let newWithdrawals = [];
  let allWithdrawals = []

  if (savedWithdrawalsKucoin && savedWithdrawalsKucoin.length > 0 && mode === 'no-update') {
    return savedWithdrawalsKucoin;

  } else if (savedWithdrawalsKucoin && savedWithdrawalsKucoin.length > 0 && mode === 'start') {

    const timeTable = JSON.parse(localStorage.getItem('time-table'));
    start = timeTable?.kucoin.withdrawals ? timeTable.kucoin.withdrawals : 1640908800000;

  } else {
    console.log('no data :start fetch trx from 01/01/22')
    start = 1640908800000;// 1/1/22
    savedWithdrawalsKucoin = []
  }

  // 1640908800000  1/1/22
  // const start = 1645776000000; // fev 22 
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
    // console.log('DATA on data ', trx);
    if (trx.error) {
      console.log(' error catched here');
      throw new Error(trx.error.message);
    }
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      // console.log(getHumanDateTime(start))
      console.log('Withdrawals found on 7 days ', trx.data.data.items);
      console.log('Withdrawals lenght ', trx.data.data.items.length);
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
      console.log('Start to fetch WITHDRAWALS for this time : ', getHumanDateTime(time));
      try {
        const data = await fetchDepositsKucoin(time);
        if (data.items) {
          const result = data.items;
          if (result.length === 0) {
            console.log('No new withdrawals')
          } else {
            console.log('New withdrawals : ', result.length)
          }
          newWithdrawals = newWithdrawals.concat(data.items);
        } else {
          console.log('result raw', data)
        }

      } catch (error) {
        toast('error.error');
        console.log('error catched :', error);
      }
      await delay(300);

    } else {
      console.log('Time recherched > now: STOP');
      // enregister le dernier time checké 
      saveLastTimeChecked('kucoin', 'withdrawals', time - oneWeek);
      break;
    }
  }

  console.log('NEW deposit', newWithdrawals)

  if (newWithdrawals.length > 0) {
    newWithdrawals = await addUrlImage(newWithdrawals, 'kucoin', 'withdrawals');
    newWithdrawals = await rebuildDataKucoin(newWithdrawals)
  }

  allWithdrawals = [...newWithdrawals, ...savedWithdrawalsKucoin]

  console.log('Withdrawals parsed', allWithdrawals);
  localStorage.setItem('withdrawals-kucoin', JSON.stringify(allWithdrawals));
  return allWithdrawals;
}

export default withdrawalsKucoin;