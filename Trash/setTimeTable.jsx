import axios from 'axios';
import config from '../src/config'

const setTimeTable = async (userData, exchange, typeTransaction = null, timestamp = 1640908800000) => {

  console.log('Set TimeTable', exchange)
  console.log('user Data ', userData)
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

export default setTimeTable