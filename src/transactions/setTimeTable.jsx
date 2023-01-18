import config from '../config';
// import getTimeTable from './getTimeTable';
// import setTimeTable from './setTimeTable';
// import getHumanDateTime from './getHumanDate';
import axios from 'axios';

const setTable = async (userData, exchange, typeTransaction = null, timestamp = 1640908800000) => {

  console.log('Set TimeTable', exchange)
  // console.log('user Data ', userData)
  let baseUrl = "http://" + config.urlServer;

  let newTimeTable = null
  if (exchange === 'reset') {
    newTimeTable = config.timeTable
  }

  const data = {
    id: userData.id,
    timestamp: timestamp,
    exchange: exchange,
    typeTransaction: typeTransaction,
    newTimeTable: newTimeTable
  };

  let response = await axios.post(baseUrl + '/set-time-table', data,
    { headers: { 'authorization': userData.token } }
  );

  return response.data
}


const setTimeTable = async (exchange, type, time, userData) => {

  console.log('Save Last Time Checked : ', exchange, 'type;', type, time, 'user:', userData.id);
  // console.log(getHumanDateTime(time))
  const exchangesList = config.exchanges;
  // console.log(exchangesList);

  if (!exchangesList.includes(exchange)) {
    throw new Error("L'exchange n'est pas dans la liste");
  }

  await setTable(userData, exchange, type, time)
}

export default setTimeTable
