
import config from "../../config";
import addUrlImage from "../../helpers/addUrlImage";
import eraseDoublon from "../../helpers/eraseDoublon";
import getLastestTransactionsCoinbase from "./getLastestTransactionsCoinbase";
import rebuildDataCoinbase from "./rebuildDataCoinbase";
import { toast } from 'react-toastify';

import getAllAccountsCoinbase from "./getAllAccounts";
import saveNewTransactions from "../saveNewTransactions";
import getQuote from "../getQuoteHistory";

async function fetchAllTransacWithPath(path, searchDirection, userData) {

  let nexPageTrxUri = null;
  let previousTrxUri = null;

  async function fetchTransac(path) {

    const data = {
      email: userData.email,
      exchange: 'coinbase',
      path: path
    };

    const response = await fetch('http://' + config.urlServer + '/coinbase/transactions', {
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
    const trxPage = await response.json();
    if (trxPage.data.length > 0) {
      toast('New Transaction find for ' + trxPage.data[0].amount.currency);
      console.log('------');
      console.log('Trx Page', trxPage.pagination);
      console.log('New Trx data', trxPage.data);
    }
    nexPageTrxUri = trxPage.pagination.next_uri;
    previousTrxUri = trxPage.pagination.previous_uri;
    return trxPage;
  }

  let accountTransactions = [];


  const data = await fetchTransac(path);

  accountTransactions = accountTransactions.concat(data.data);

  switch (searchDirection) {
    case 'next':
      while (nexPageTrxUri !== null) {
        const dataNextPage = await fetchTransac(nexPageTrxUri);
        console.log('There is a next page');
        accountTransactions = accountTransactions.concat(dataNextPage.data);
      }
      break;

    case 'previous':
      while (previousTrxUri !== null) {
        const dataPrevPage = await fetchTransac(previousTrxUri);
        console.log('There is a previous page');
        accountTransactions = accountTransactions.concat(dataPrevPage.data);
      }
      break;

    default:
      break;
  }


  return accountTransactions;
}


const getAllTransactions = async (accounts, userData) => {


  let index = 0;
  let transactions = [];
  while (index < accounts.length && index < 5000) {
    console.log(index)
    let account = accounts[index];
    try {
      let path = '/v2/accounts/' + account.id + "/transactions";
      let newTrx = await fetchAllTransacWithPath(path, 'next', userData);
      if (newTrx.length > 0) {
        console.log('_______!!! new TRX a enregistrer en DB ')
        console.log(newTrx)
        newTrx = await postProcess(newTrx, userData);

        // Save in DB 
        saveNewTransactions(newTrx, userData)

      }

      transactions = [...transactions, ...newTrx]

    } catch (error) {
      console.log('error catched :', error);
    }
    index++;
  }
  console.log(transactions)
  return transactions;
}

const postProcess = async (transactions, userData) => {

  // const data = eraseDoublon(transactions)
  transactions = await addUrlImage(transactions, 'coinbase')
  // rebuild data for table datagri
  transactions = await rebuildDataCoinbase(transactions, userData);
  transactions = getQuote(transactions)
  // setTransactions(result);
  // localStorage.setItem('transactions-coinbase', JSON.stringify(result))
  return transactions

}

const fetchNewCurrentTokenTransactions = async (lastTrx) => {


  let index = 0;
  let transactions = [];

  while (index < lastTrx.length) {

    let account = lastTrx[index];
    let query = "?ending_before=" + account.id_last_trx;
    try {
      let path = '/v2/accounts/' + account.id_account + "/transactions" + query;
      const data = await fetchAllTransacWithPath(path, 'previous');
      transactions = [...transactions, ...data]

    } catch (error) {
      console.log('error catched :', error);
    }

    index++;
    // setPourcentLoad(index * 100 / (lastTrx.length))
    console.log(parseInt(index * 100 / (lastTrx.length)) + '%');
    console.log('token', account?.token);
  }

  // setPourcentLoad(0);
  return transactions;
}


const getAllNewTransactions = async (coinbaseTrxDB, userData, checkIfNewAccount = false) => {

  const accountSaved = JSON.parse(localStorage.getItem('accounts-coinbase'));

  console.log(accountSaved)
  let accounts = []

  // console.log(accounts)
  // return []

  if (coinbaseTrxDB.length === 0) {
    console.log('Procces all ')
    accounts = await getAllAccountsCoinbase(userData, true);
    let allTransactions = await getAllTransactions(accounts, userData);

    return allTransactions

  }
  else {
    console.log('Update all ')
    const lastTrxSaved = getLastestTransactionsCoinbase(coinbaseTrxDB);
    console.log('Last current TRX', lastTrxSaved);
    console.log('Last current TRX lenght', lastTrxSaved.length);

    // Check if new account
    accounts = await getAllAccountsCoinbase(userData, checkIfNewAccount);
    let positiveAccount = accounts.filter(account => {
      return parseFloat(account.balance.amount) > 0
    })
    let newAccount = []
    // Verifie si de nouveau token sont présent 
    // dans les account mais ou il n'y a pas encore de transactions présente
    positiveAccount.forEach((account, index) => {

      const isObjectPresent = lastTrxSaved.find((o) => o.token === account.balance.currency);

      if (isObjectPresent === undefined) {
        // console.log(ObjIdToFind, ' - ', isObjectPresent)
        toast(positiveAccount[index].balance.currency + " trouvé")
        newAccount.push(positiveAccount[index]);
      }
    })

    console.log('newAccount ', newAccount);
    if (newAccount.length === 0) {
      toast("Pas de nouveau token trouvé")
    }
    let newAcountTrx = [];
    if (newAccount.length > 0) {

      newAcountTrx = await getAllTransactions(newAccount);
      console.log('New account find with new trx', newAcountTrx);
      if (newAcountTrx.length > 0) {
        newAcountTrx = await postProcess(newAcountTrx);
        // // Save in DB 
        saveNewTransactions(newAcountTrx, userData)
      }
    }


    // Fetch existant token 
    let newTrx = [];
    newTrx = await fetchNewCurrentTokenTransactions(lastTrxSaved);

    if (newTrx.length > 0) {
      console.log('New trx : ', newTrx);
      toast("Nouvelle transaction Coinbase trouvée")
      newTrx = await postProcess(newTrx);
      saveNewTransactions(newTrx, userData)
    } else {
      toast("Pas de nouvelle transaction Coinbase avec ce nouveau token")
    }

    let allTransactions = [...newTrx, ...newAcountTrx];
    // totalTrx = await rebuildDataCoinbase(totalTrx, 'coinbase');
    console.log('lenght', allTransactions.length);
    return allTransactions;

  }





}

export default getAllNewTransactions 