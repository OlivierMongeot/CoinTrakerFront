
import config from "../../config";
import addUrlImage from "../../helpers/addUrlImage";
import eraseDoublon from "../../helpers/eraseDoublon";
import getLastestTransactionsCoinbase from "./getLastestTransactionsCoinbase";
import rebuildDataCoinbase from "./rebuildDataCoinbase";
import { toast } from 'react-toastify';

import getAllAccountsCoinbase from "./getAllAccounts";
import saveNewTransactions from "../saveNewTransactionsDB";
import getQuote from "../getQuoteHistory";


const FETCHMAX = 30


async function getAllTransactionsByAccount(path, searchDirection, userData) {

  let nextPageTrxPath = null;
  let previousPageTrxPath = null;

  async function getOnePageTransactions(path) {

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
      // toast('New Transaction find for ' + trxPage.data[0].amount.currency);
      console.log('------');
      // console.log('Trx Page', trxPage.pagination);
      console.log('New Trx data', trxPage.data);
      let newTrx = trxPage.data

      // newTrx = await addUrlImage(newTrx, 'coinbase')
      // newTrx = await rebuildDataCoinbase(newTrx, userData);
      // console.log('after post process + save in DB :', newTrx)
      // Save in DB 
      // saveNewTransactions(newTrx, userData)

    }
    nextPageTrxPath = trxPage.pagination.next_uri;
    previousPageTrxPath = trxPage.pagination.previous_uri;
    return trxPage;
  }

  let accountTransactions = [];

  const data = await getOnePageTransactions(path);
  accountTransactions = accountTransactions.concat(data.data);

  switch (searchDirection) {
    case 'next':
      while (nextPageTrxPath !== null) {
        const dataNextPage = await getOnePageTransactions(nextPageTrxPath);
        console.log('There is a next page');
        accountTransactions = accountTransactions.concat(dataNextPage.data);
      }
      break;

    case 'previous':
      while (previousPageTrxPath !== null) {
        const dataPrevPage = await getOnePageTransactions(previousPageTrxPath);
        console.log('There is a previous page');
        accountTransactions = accountTransactions.concat(dataPrevPage.data);
      }
      break;

    default:
      break;
  }
  return accountTransactions;
}


const getAllTransactionsTheseAccounts = async (accounts, userData) => {

  let index = 0;
  let transactions = [];
  while (index < accounts.length && index < 500) {
    console.log(index)
    let account = accounts[index];
    try {
      let accountPath = '/v2/accounts/' + account.id + "/transactions";
      // console.log('user data ', userData)
      console.log('account', account.name)
      let newTrx = await getAllTransactionsByAccount(accountPath, 'next', userData);

      transactions = [...transactions, ...newTrx]

    } catch (error) {
      console.log('error catched :', error);
    }
    index++;
  }
  // console.log(transactions)
  return transactions;
}

const getAccountZeroWithTransaction = async (accounts, userData) => {

  const accountsToZero = accounts.filter(account => parseFloat(account.balance.amount) === 0)
  console.log('account to zer', accountsToZero);
  return accountsToZero
  //  await getAllTransactionsTheseAccounts(accountsToZero, userData)
}



const getNewTokenTransactions = async (lastTrxSavedDB, userData, checkIfNewAccount, fetchZero) => {

  let accounts = await getAllAccountsCoinbase(userData, checkIfNewAccount);
  let positiveAccount = accounts.filter(account => {
    return parseFloat(account.balance.amount) > 0
  })

  let newAccounts = []
  positiveAccount.forEach((account, index) => {
    const isObjectPresent = lastTrxSavedDB.find((o) => o.token === account.balance.currency);
    if (isObjectPresent === undefined) {
      newAccounts.push(positiveAccount[index]);
    }
  })
  console.log('new Account Amount positive find ', newAccounts);

  // Add account with amount zero but with trx 
  let accountZero = []
  if (fetchZero) {
    accountZero = await getAccountZeroWithTransaction(accounts, userData);
    console.log('new transaction Account Zero find ', accountZero);
  }
  newAccounts = [...newAccounts, ...accountZero]

  if (newAccounts.length > 0) {
    toast('Nouveaux accounts trouvés ')
  }
  let newTrxFromNewAccount = [];

  newTrxFromNewAccount = await getAllTransactionsTheseAccounts(newAccounts, userData);
  //   console.log('New account find with new trx', newAcountTrx);
  if (newTrxFromNewAccount.length > 0) {
    // // Save in DB 
    console.log('Nouvelle transaction Coinbase trouvée pour nouveau account')
    // saveNewTransactions(newTrxFromNewAccount, userData)
    // toast("Nouvelle transaction Coinbase trouvée pour nouveau account")
    return newTrxFromNewAccount
  } else {
    return []
  }

}

const getFromDBTransactions = async (lastTrx, userData) => {

  let index = 0;
  let transactions = [];

  while (index < lastTrx.length) {

    let account = lastTrx[index];
    let query = "?ending_before=" + account.id_last_trx;
    try {
      let accountPath = '/v2/accounts/' + account.id_account + "/transactions" + query;
      const newTrx = await getAllTransactionsByAccount(accountPath, 'previous', userData);
      transactions = [...transactions, ...newTrx]
    } catch (error) {
      console.log('error catched :', error);
    }

    index++;
    // setPourcentLoad(index * 100 / (lastTrx.length))
    console.log(parseInt(index * 100 / (lastTrx.length)) + '%');
    console.log('token', account?.token);
  }


  if (transactions.length > 0) {
    console.log('New trx : ', transactions);
    toast("Nouvelle transaction Coinbase trouvée")
  }

  // setPourcentLoad(0);
  return transactions;
}

// Fonction Principale
const getAllNewTransactionsCoinbase = async (coinbaseTrxDB, userData, checkIfNewAccount = false, fetchZero = false) => {

  console.log('getAllNewTransactionsCoinbase coinbaseTrxDB', coinbaseTrxDB)
  const listLastTrxSavedDB = getLastestTransactionsCoinbase(coinbaseTrxDB);
  console.log('Last current TRX', listLastTrxSavedDB);


  console.log('---- PART 1 ---')
  let newTrxFromNewAccount = [];
  newTrxFromNewAccount = await getNewTokenTransactions(listLastTrxSavedDB, userData, checkIfNewAccount, fetchZero)


  console.log('---- PART 2 ---')
  let newTrxFromDB = [];
  newTrxFromDB = await getFromDBTransactions(listLastTrxSavedDB, userData);


  let allTransactions = [...newTrxFromDB, ...newTrxFromNewAccount];
  console.log('---- END  ---')
  // console.log('lenght', allTransactions.length);
  return allTransactions

}

export default getAllNewTransactionsCoinbase 