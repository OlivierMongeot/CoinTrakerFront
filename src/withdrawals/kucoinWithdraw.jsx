import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import getFiatValue from '../helpers/getFiatValue';
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';
import getSimpleDate from '../helpers/getSimpleDate';


const withdrawalsKucoin = async (mode, userData) => {

  console.log('----------START WITHDRAWALS FETCH---------------')

  const allTransactions = JSON.parse(localStorage.getItem('transactions-all'))
  let savedWithdrawalsKucoin = allTransactions.filter(transaction => {
    return transaction.exchange === 'kucoin' && transaction.transaction === 'withdrawals'
  })

  console.log('Withdrawals kucoin saved ', savedWithdrawalsKucoin);

  const rebuildDataKucoin = async (withdrawals) => {
    console.log('rebuild Withdraw kucoin')

    let index = 0;
    while (index < withdrawals.length) {
      withdrawals[index].title = 'Address withdrawals : ' + withdrawals[index].address; // For datagrid
      withdrawals[index].exchange = 'kucoin' // For datagrid
      withdrawals[index].id = withdrawals[index].walletTxId; // For datagrid
      withdrawals[index].smartType = 'Blockchain : ' + withdrawals[index].chain.toUpperCase();
      withdrawals[index].updated_at = new Date(withdrawals[index].createdAt) // For datagrid

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

  const oneWeek = 604800000;
  const sevenDayPeriode = 52;
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
    saveLastTimeChecked('kucoin', 'withdrawals', start + oneWeek);
    if (trx.data && trx.data.data.items && trx.data.data.items.length > 0) {
      console.log('Withdrawals found on 7 days ', trx.data.data.items.length);
    }

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
  return allWithdrawals;
}

export default withdrawalsKucoin;