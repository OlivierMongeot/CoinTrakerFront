import addUrlImage from "../../helpers/addUrlImage"
import setTimeTable from "../setTimeTable"
import getAllNewTransactionsGateIo from "./getNewtransactionGateIo"
import rebuildGateIoData from "./rebuildDataGateIo"


const oneMonth = 604800 * 4

const getNewWithdrawalsGateIo = async (userData, timeStart) => {

  let totalWithdrawals = []
  let startWithdrawals = timeStart.gateio.withdrawals
  while (startWithdrawals < (Date.now() / 1000)) {
    console.log('current fetch withdrawals ', startWithdrawals)
    let withdrawals = await getAllNewTransactionsGateIo(userData, startWithdrawals, 'withdrawals')
    startWithdrawals = startWithdrawals + oneMonth
    if (withdrawals.length > 0) {
      // totalWithdrawals.push(withdrawals)
      withdrawals = await addUrlImage(withdrawals, 'gateio')
      withdrawals = await rebuildGateIoData(withdrawals, 'withdrawals');
      setTimeTable('gateio', 'withdrawals', parseInt(startWithdrawals), userData)
      return [withdrawals, 'stop']

    }
  }
  // totalWithdrawals = totalWithdrawals.flat()
  // if (totalWithdrawals.length > 0) {
  // console.log('NEW WITHDRAWAL', totalWithdrawals)
  // }

  return [totalWithdrawals, 'stop']


}

export default getNewWithdrawalsGateIo