import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import saveLastTimeChecked from '../helpers/saveLastTimeChecked'
import getHumanDateTime from '../helpers/getHumanDate';

const depositKucoin = async (mode, userData) => {

  console.log('----------START DEPOSITS FETCH---------------')

  let savedDepositsKucoin = JSON.parse(localStorage.getItem('deposits-kucoin'));
  console.log('Deposit kucoin saved ', savedDepositsKucoin.length);

  const rebuildDataKucoin = (deposits) => {
    console.log('rebuild Deposit kucoin')
    deposits.forEach(element => {

      element.title = 'Address deposit : ' + element.address;
      element.exchange = 'kucoin'
      element.id = element.walletTxId;
      element.smartType = 'Blockchain : ' + element.chain.toUpperCase();
      element.updated_at = new Date(element.createdAt)
      element.token = element.currency;

      let currencyTab = element.currency;

      element.entry = {
        amount: element.amount,
        currency: currencyTab,
        urlLogo: element.urlLogo
      }
      element.exit = {
        amount: 0,
        currency: ''

      }
      element.native_amount = { amount: element.amount, currency: currencyTab };
      element.transaction = element.remark;

    })
    return deposits;
  }

  let start = null;
  let newDeposits = [];
  let allDeposits = []

  if (savedDepositsKucoin && savedDepositsKucoin.length > 0 && mode === 'no-update') {
    return savedDepositsKucoin;

  } else if (savedDepositsKucoin && savedDepositsKucoin.length > 0 && mode === 'start') {
    // console.log('start from last deposit') // to do last deposit ceck 
    // const fetchDepositsKucoin = savedDepositsKucoin.reduce((r, o) => new Date(o.createdAt) > new Date(r.createdAt) ? o : r);
    // console.log(fetchDepositsKucoin)
    // start = fetchDepositsKucoin.createdAt + 1;

    const timeTable = JSON.parse(localStorage.getItem('time-table'))
    // console.log('timeTable', timeTable);
    start = timeTable?.kucoin.deposit ? timeTable.kucoin.deposit : 1640908800000
    // console.log('start from last Deposit check saved ', getHumanDateTime(start))

  } else {
    console.log('no data : fetch trx from 01/01/22')
    start = 1640908800000;// 1/1/22
    savedDepositsKucoin = []
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
  localStorage.setItem('deposits-kucoin', JSON.stringify(allDeposits));
  return newDeposits;
}

export default depositKucoin;