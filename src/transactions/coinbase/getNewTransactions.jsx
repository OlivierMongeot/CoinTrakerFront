
import config from "../../config";
import addUrlImage from "../../helpers/addUrlImage";
import eraseDoublon from "../../helpers/eraseDoublon";
import getLastestTransactionsCoinbase from "./getLastestTransactionsCoinbase";
import rebuildDataCoinbase from "./rebuildDataCoinbase";
import { toast } from 'react-toastify';

import getAllAccountsCoinbase from "./getAllAccounts";
import saveNewTransactions from "../saveNewTransactionsDB";
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
      let newTrx = trxPage.data


      newTrx = await addUrlImage(newTrx, 'coinbase')
      newTrx = await rebuildDataCoinbase(newTrx, userData);
      console.log('after post process + save in DB :', newTrx)
      // Save in DB 
      saveNewTransactions(newTrx, userData)

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
      // console.log('user data ', userData)
      console.log('account', account)
      let newTrx = await fetchAllTransacWithPath(path, 'next', userData);

      transactions = [...transactions, ...newTrx]

    } catch (error) {
      console.log('error catched :', error);
    }
    index++;
  }
  console.log(transactions)
  return transactions;
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


  let accounts = []

  console.log('coinbaseTrxDB', coinbaseTrxDB)
  // return []

  if (coinbaseTrxDB.length === 0) {
    console.log('Procces all ')
    accounts = await getAllAccountsCoinbase(userData, true);
    let allTransactions = await getAllTransactions(accounts, userData);
    return allTransactions

  }
  else {
    console.log('Update all ')
    const lastTrxSavedDB = getLastestTransactionsCoinbase(coinbaseTrxDB);
    console.log('Last current TRX', lastTrxSavedDB);
    console.log('Last current TRX lenght', lastTrxSavedDB.length);

    // Check if new account
    accounts = await getAllAccountsCoinbase(userData, checkIfNewAccount);
    let positiveAccount = accounts.filter(account => {
      return parseFloat(account.balance.amount) > 0
    })
    let newAccount = []
    // Verifie si de nouveau token sont présent 
    // dans les account mais ou il n'y a pas encore de transactions présente
    positiveAccount.forEach((account, index) => {

      const isObjectPresent = lastTrxSavedDB.find((o) => o.token === account.balance.currency);

      if (isObjectPresent === undefined) {
        // console.log(ObjIdToFind, ' - ', isObjectPresent)
        toast(positiveAccount[index].balance.currency + " trouvé")
        newAccount.push(positiveAccount[index]);
      }
    })

    console.log('new Account find ', newAccount.name);
    if (newAccount.length === 0) {
      toast("Pas de nouveau token trouvé")
    }
    let newTrxForNewAccount = [];
    // if (newAccount.length > 0) {

    newTrxForNewAccount = await getAllTransactions(newAccount, userData);
    //   console.log('New account find with new trx', newAcountTrx);
    if (newTrxForNewAccount.length > 0) {

      // // Save in DB 
      console.log('Threre is new account trx', newTrxForNewAccount)
      // saveNewTransactions(newAcountTrx, userData)
    }



    // Fetch existant token 
    let newTrx = [];
    // newTrx = await fetchNewCurrentTokenTransactions(lastTrxSaved);

    // if (newTrx.length > 0) {
    //   console.log('New trx : ', newTrx);
    //   toast("Nouvelle transaction Coinbase trouvée")

    // transactions = await addUrlImage(transactions, 'coinbase')
    // transactions = await rebuildDataCoinbase(transactions, userData);
    // //   saveNewTransactions(newTrx, userData)
    // } else {
    //   toast("Pas de nouvelle transaction Coinbase avec ce nouveau token")
    // }

    let allTransactions = [...newTrx, ...newTrxForNewAccount];
    // totalTrx = await rebuildDataCoinbase(totalTrx, 'coinbase');
    console.log('lenght', allTransactions.length);
    return allTransactions;

  }





}

export default getAllNewTransactions 