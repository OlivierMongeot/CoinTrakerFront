import getTimeTable from "../getTimeTable"
// import getTransactionsGateIo from "./getNewTransactionsGateIo";
import config from "../../config";

const oneMonth = 604800 * 4

const fetchTransactionsGateIo = async (userData, start, type) => {

  const data = {
    email: userData.email,
    exchange: 'gateio',
    start: start,
    id: userData.id
  };
  console.log('type ', type, start)

  const response = await fetch('http://' + config.urlServer + '/gateio/' + type, {
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

  let res = await response.json();
  return res
}

const getAllNewTransactionsGateIo = async (userData, type) => {

  const timeStart = await getTimeTable(userData)

  let start = null
  switch (type) {
    case 'withdrawals':
      start = timeStart.gateio.withdrawals
      break;

    case 'deposits':
      start = timeStart.gateio.deposits
      break;

    case 'trades':
      start = timeStart.gateio.trades
      break;

    default:
      throw Error('No type available')
  }

  let transactions = await fetchTransactionsGateIo(userData, start, type)
  let end = start + oneMonth

  if (transactions.length > 0) {
    transactions = transactions.filter(element => (element.currency !== 'USDTEST'))
    transactions = transactions.filter(element => (element.status !== 'cancelled'))
    console.log('raw transactions ', transactions)
    return [transactions, 'continue', parseInt(end)]

  } else {
    if (end < (Date.now() / 1000)) {
      console.log('NO DATA BUT CONTINUE ', type)
      return [[], 'continue', parseInt(end)]
    } else {
      console.log('Stop time > now for ', type)
      return [[], 'stop', Date.now() / 1000]
    }
  }
}

export default getAllNewTransactionsGateIo