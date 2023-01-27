import { toast } from "react-toastify";
import addOneUrlImage from "../../helpers/addOneUrlImage";
import getSingleQuote from "../getSingleQuote";
import saveNewTransactions from "../saveNewTransactionsDB";
import rebuildOneGateIoData from "./rebuildOneDataGateIo";


const rebuild = async (transaction, userData, type, previousTransactions) => {
  let newGateIoTransactions = await addOneUrlImage(transaction, 'gateio', type, userData)
  newGateIoTransactions = await rebuildOneGateIoData(newGateIoTransactions, type);
  console.log(newGateIoTransactions)
  newGateIoTransactions = await getSingleQuote(newGateIoTransactions, previousTransactions)

  if (newGateIoTransactions.currency !== previousTransactions?.currency) {
    toast('New transaction for ' + newGateIoTransactions.currency)
  }
  await saveNewTransactions([newGateIoTransactions], userData)
  return newGateIoTransactions
}

export default rebuild