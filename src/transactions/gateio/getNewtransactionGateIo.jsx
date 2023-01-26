import config from "../../config";
import addUrlImage from "../../helpers/addUrlImage";
import getTimeTable from "../getTimeTable";
import setTimeTable from "../setTimeTable";
import rebuildGateIoData from "./rebuildDataGateIo";



const getTransactionGateIo = async (userData, start, type) => {

  const data = {
    email: userData.email,
    exchange: 'gateio',
    start: start,
    id: userData.id
  };

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

// Fonction Principale
const getAllNewTransactionsGateIo = async (userData) => {


  // Get Last Time Check in DB
  const timeStart = await getTimeTable(userData)
  const oneMonth = 604800 * 4


  // DEPOSIT 
  let totalDeposits = []
  let startDepositGateIo = timeStart.gateio.deposits
  console.log('Start New Deposits ', startDepositGateIo)

  while (startDepositGateIo < (Date.now() / 1000)) {
    console.log('current fetch depot ', startDepositGateIo)
    let deposits = await getTransactionGateIo(userData, startDepositGateIo, 'deposits')
    startDepositGateIo = startDepositGateIo + oneMonth
    if (deposits.length > 0) {
      totalDeposits.push(deposits)
    }
  }

  totalDeposits = totalDeposits.flat()

  if (totalDeposits.length > 0) {
    totalDeposits = totalDeposits.flat()
    totalDeposits = await addUrlImage(totalDeposits, 'gateio')
    totalDeposits = await rebuildGateIoData(totalDeposits, 'deposits');
    console.log('NEW DEPOSITS', totalDeposits)
  }
  setTimeTable('gateio', 'deposits', parseInt(startDepositGateIo), userData)


  // WITHDRAWAL 
  let totalWithdrawals = []
  // let startWithdrawals = timeStart.gateio.withdrawals
  // while (startWithdrawals < (Date.now() / 1000)) {
  //   console.log('current fetch withdrawals ', startWithdrawals)
  //   let withdrawals = await getTransactionGateIo(userData, startWithdrawals, 'withdrawals')
  //   startWithdrawals = startWithdrawals + oneMonth
  //   if (withdrawals.length > 0) {
  //     totalWithdrawals.push(withdrawals)
  //   }
  // }
  // totalWithdrawals = totalWithdrawals.flat()
  // if (totalWithdrawals.length > 0) {
  //   totalWithdrawals = await addUrlImage(totalWithdrawals, 'gateio')
  //   totalWithdrawals = await rebuildGateIoData(totalWithdrawals, 'withdrawals');
  //   console.log('NEW WITHDRAWAL', totalWithdrawals)

  // }
  // setTimeTable('gateio', 'withdrawals', parseInt(startWithdrawals), userData)

  // TRADES 
  let totalTrades = []
  // let startTrades = timeStart.gateio.trades
  // console.log("first start", startTrades)
  // // while (startTrades < (Date.now() / 1000)) {
  // while (startTrades < (1653004800)) {
  //   console.log('current fetch trades ', startTrades)
  //   let trades = await getTransactionGateIo(userData, startTrades, 'trades')
  //   startTrades = startTrades + oneMonth
  //   if (trades.length > 0) {
  //     totalTrades.push(trades)
  //   }
  // }
  // totalTrades = totalTrades.flat()

  // if (totalTrades.length > 0) {
  //   totalTrades = await addUrlImage(totalTrades, 'gateio')
  //   totalTrades = await rebuildGateIoData(totalTrades, 'trades');
  //   console.log('NEW TRADES', totalTrades)
  // }
  // setTimeTable('gateio', 'trades', parseInt(startTrades), userData)


  return [...totalWithdrawals, ...totalDeposits, ...totalTrades]

}

export default getAllNewTransactionsGateIo