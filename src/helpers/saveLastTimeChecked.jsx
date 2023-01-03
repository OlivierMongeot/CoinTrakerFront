import config from '../config';
import getHumanDateTime from './getHumanDate';


const saveLastTimeChecked = (exchange, type, time) => {

  console.log('save Last Time Checked', exchange, type);
  console.log(getHumanDateTime(time))
  const exchangesList = config.exchanges;
  // console.log(exchangesList);

  if (!exchangesList.includes(exchange)) {
    throw new Error("L'exchange n'est pas dans la liste");
  }

  let currentTimesTable = JSON.parse(localStorage.getItem('time-table'));

  if (currentTimesTable === null) {
    console.log('new times table')
    currentTimesTable =
    {
      'kucoin':
        { deposit: 1640908800000, withdrawals: 1640908800000, trade: 1640908800000 }
      ,
      'coinbase':
        { trade: 1640908800000 },
      'binance':
        { trade: 1640908800000 },
      'gateio':
        { trade: 1640908800000 },
      'crytpo-com':
        { trade: 1640908800000 }
    }

  }

  currentTimesTable[exchange][type] = time;

  localStorage.setItem('time-table', JSON.stringify(currentTimesTable))

}

export default saveLastTimeChecked
