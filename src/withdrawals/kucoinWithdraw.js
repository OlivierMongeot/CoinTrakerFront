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

  const rebuildDataKucoin = async (withdrawals) => {
    console.log('rebuild Withdraw kucoin')

    // withdrawals.forEach(element => {

    //   element.title = 'Address withdrawals : ' + element.address;
    //   element.exchange = 'kucoin'
    //   element.id = element.walletTxId;
    //   element.smartType = 'Blockchain : ' + element.chain.toUpperCase();
    //   element.updated_at = new Date(element.createdAt)
    //   element.token = element.currency;

    //   element.exit = {
    //     amount: element.amount,
    //     currency: element.currency,
    //     urlLogo: element.urlLogo
    //   }
    //   element.entry = {
    //     amount: 0,
    //     currency: ''

    //   }

    //   element.native_amount = { amount: element.amount, currency: element.currency };

    //   element.transaction = 'withdrawals'

    // })

    let index = 0;
    while (index < withdrawals.length) {
      console.log(index);

      withdrawals[index].title = 'Address withdrawals : ' + withdrawals[index].address;
      withdrawals[index].exchange = 'kucoin'
      withdrawals[index].id = withdrawals[index].walletTxId;
      withdrawals[index].smartType = 'Blockchain : ' + withdrawals[index].chain.toUpperCase();
      withdrawals[index].updated_at = new Date(withdrawals[index].createdAt)
      withdrawals[index].token = withdrawals[index].currency;

      withdrawals[index].exit = {
        amount: withdrawals[index].amount,
        currency: withdrawals[index].currency,
        urlLogo: withdrawals[index].urlLogo
      }
      withdrawals[index].entry = {
        amount: 0,
        currency: ''

      }

      withdrawals[index].native_amount = { amount: withdrawals[index].amount, currency: withdrawals[index].currency };

      withdrawals[index].transaction = 'withdrawals'


      withdrawals[index].quote_transaction = {
        amount: withdrawals[index].amount,
        devises: await getFiatValue(withdrawals[index].currency, withdrawals[index].createdAt)
      };
      index++;
    }


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

  console.log('NEW withdrawals', newWithdrawals)

  if (newWithdrawals.length > 0) {
    newWithdrawals = await addUrlImage(newWithdrawals, 'kucoin', 'withdrawals');
    newWithdrawals = await rebuildDataKucoin(newWithdrawals)
  }

  allWithdrawals = [...newWithdrawals, ...savedWithdrawalsKucoin]
  allWithdrawals = await rebuildDataKucoin(allWithdrawals)
  // console.log('Withdrawals parsed', allWithdrawals);
  localStorage.setItem('withdrawals-kucoin', JSON.stringify(allWithdrawals));
  // return allWithdrawals;
  return newWithdrawals;
}

export default withdrawalsKucoin;