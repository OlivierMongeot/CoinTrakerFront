import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import getFiatValue from '../helpers/getFiatValue';
import saveLastTimeChecked from '../helpers/saveLastTimeChecked';
import getHumanDateTime from '../helpers/getHumanDate';

const withdrawalsKucoin = async (mode, userData) => {

  let savedWithdrawalsKucoin = JSON.parse(localStorage.getItem('withdrawals-kucoin'));

  console.log('Withdrawals kucoin saved ', savedWithdrawalsKucoin);

  const rebuildDataKucoin = (deposits) => {
    console.log('rebuild Withdraw kucoin')
    deposits.forEach(element => {

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
    return deposits;
  }

  let start = null;
  let deposits = [];

  if (savedWithdrawalsKucoin && savedWithdrawalsKucoin.length > 0 && mode === 'no-update') {
    return savedWithdrawalsKucoin;

  } else if (savedWithdrawalsKucoin && savedWithdrawalsKucoin.length > 0 && mode === 'start') {
    // console.log('start from last withdraw') // to do last deposit ceck 
    // const lastDepositsKucoin = savedWithdrawalsKucoin.reduce((r, o) => new Date(o.createdAt) > new Date(r.createdAt) ? o : r);
    // console.log(lastDepositsKucoin)
    // start = lastDepositsKucoin.createdAt + 1;

    const timeTable = JSON.parse(localStorage.getItem('time-table'))
    console.log('timeTable', timeTable);
    start = timeTable?.kucoin.withdrawals ? timeTable.kucoin.withdrawals : 1640908800000;
    console.log('start from last withdrawals check saved ', getHumanDateTime(start))
    // deposits = savedDepositsKucoin

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
    console.log('index', index);

    let time = start + (oneWeek * index)
    index++;
    if (time < now) {
      console.log('check Withdraw for this time + 7d:', getHumanDateTime(time));
      try {
        const data = await fetchDepositsKucoin(time);
        if (data.items) {
          deposits = deposits.concat(data.items);
        } else {
          console.log('result raw', data)
        }

      } catch (error) {
        toast('error.error');
        console.log('error catched :', error);
      }
      await delay(300);

    } else {
      console.log('Time recherched > now');
      // enregister le dernier time checké 
      saveLastTimeChecked('kucoin', 'withdrawals', time - oneWeek);
      break;
    }
  }



  let res = await addUrlImage(deposits, 'kucoin', 'deposits')
  res = await rebuildDataKucoin(deposits)

  res = [...res, ...savedWithdrawalsKucoin]
  res = await rebuildDataKucoin(res)

  console.log('Withdrawals parsed', res);
  localStorage.setItem('withdrawals-kucoin', JSON.stringify(res));
  return res;
}

export default withdrawalsKucoin;