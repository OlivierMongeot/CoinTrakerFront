
import config from '../../config';
import { toast } from 'react-toastify';
import addUrlImage from '../../helpers/addUrlImage'
import eraseDoublon from '../../helpers/eraseDoublon';
import getLastestTransactionsCoinbase from './getLastestTransactionsCoinbase';
import rebuildDataCoinbase from './rebuildDataCoinbase';

const proccesTransactionCoinbase = async (mode, userData) => {

  console.log('process Coinbase trx ')


  const postProcess = async (transactions) => {

    const data = eraseDoublon(transactions)
    let result = await addUrlImage(data, 'coinbase')
    // rebuild data for table datagrid
    if (result.length > 0) {

      result = await rebuildDataCoinbase(result, userData);
      // setTransactions(result);
      // localStorage.setItem('transactions-coinbase', JSON.stringify(result))
      return result
    } else {
      toast('Proccess error')
      console.log('PostProccess error ')
      return []
    }
  }


  const fetchAllAccountCoinbase = async () => {

    let nexPageAccounUri = null;
    let accounts = [];

    async function fetchAccount(path) {

      const data = {
        email: userData.email,
        exchange: 'coinbase',
        path: path
      };

      const response = await fetch('http://' + config.urlServer + '/coinbase/accounts', {
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
      const accountsPage = await response.json();
      console.log('Get new Account : ', accountsPage.data.length);
      // console.log('Account Page', accountsPage.pagination);
      nexPageAccounUri = accountsPage.pagination.next_uri;
      return accountsPage;

    }

    try {
      const data = await fetchAccount('/v2/accounts');
      accounts = accounts.concat(data.data);
    } catch (error) {
      console.log('error catched :', error);
    }

    while (nexPageAccounUri !== null) {
      const dataNextPage = await fetchAccount(nexPageAccounUri);
      accounts = accounts.concat(dataNextPage.data);
    }
    // Lenght of allAccounts
    console.log('Nbr de tokens', accounts.length);
    // console.log('accounts', accounts);
    // let tokenList = [];

    localStorage.setItem('accounts-coinbase', JSON.stringify(accounts));
    return accounts;
  }

  async function fetchAllTransacWithPath(path, searchDirection) {

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


  const fetchAllTransactions = async (accounts) => {

    let index = 0;
    let transactions = [];
    while (index < accounts.length) {

      let account = accounts[index];
      try {
        let path = '/v2/accounts/' + account.id + "/transactions";
        const data = await fetchAllTransacWithPath(path, 'next');
        transactions = [...transactions, ...data]

      } catch (error) {
        console.log('error catched :', error);
      }
      index++;
    }

    return transactions;
  }

  const fetchNewTransactions = async (lastTrx) => {


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


  let accounts = []
  let allTransactions = []
  let makePostProcess = false;

  // setIsLoading('');

  const accountSaved = JSON.parse(localStorage.getItem('accounts-coinbase'));


  if (accountSaved && !accountSaved.length > 0) {
    accounts = await fetchAllAccountCoinbase();
  } else {
    accounts = accountSaved;
  }

  const allTransactionsSaved = JSON.parse(localStorage.getItem('transactions-all'))
  const trxSaved = allTransactionsSaved.filter(transaction => {
    return transaction.exchange === 'coinbase'
  })



  if (trxSaved === null || !trxSaved.length > 0) {
    console.log('no trx in ls : restart all')
    allTransactions = await fetchAllTransactions(accounts);
    makePostProcess = true

  } else {
    allTransactions = trxSaved;
    makePostProcess = false;
  }


  console.log('Mode ', mode);

  switch (mode) {

    case 'force':
      accounts = await fetchAllAccountCoinbase();
      allTransactions = await fetchAllTransactions(accounts);
      return await postProcess(allTransactions);

    case 'start':
      allTransactions = await postProcess(allTransactions);

      return allTransactions

    case 'quick':

      // console.log('quick')
      accounts = await fetchAllAccountCoinbase();
      console.log('New account lenght ', accounts.length)
      // get account with amount positive
      let positiveAccount = accounts.filter(account => {
        return parseFloat(account.balance.amount) > 0

      })
      console.log('New account filtred ', positiveAccount);
      console.log('New account lenght filtred ', positiveAccount.length);

      // Return array with last transaction by token 
      const lastTrx = getLastestTransactionsCoinbase(allTransactions);
      console.log('Last current TRX', lastTrx);
      console.log('Last current TRX lenght', lastTrx.length);

      let newAccount = []
      let newTrx = [];
      let newAcountTrx = [];
      // Fetch new account token trx
      positiveAccount.forEach((account, index) => {

        // const ObjIdToFind = account.balance.currency;
        const isObjectPresent = lastTrx.find((o) => o.token === account.balance.currency);

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

      if (newAccount.length > 0) {

        newAcountTrx = await fetchAllTransactions(newAccount);
        console.log('new account trx', newAcountTrx);
        if (newAcountTrx.length > 0) {
          newAcountTrx = await postProcess(newAcountTrx);
        }
      }

      // Fetch existant token 
      newTrx = await fetchNewTransactions(lastTrx);

      if (newTrx.length > 0) {
        console.log('New trx : ', newTrx);
        toast("Nouvelle transaction Coinbase trouvée")
        newTrx = await postProcess(newTrx);
      } else {
        toast("Pas de nouvelle transaction Coinbase avec ce nouveau token")
        // console.log('no new transaction Coinbase')
      }

      allTransactions = [...allTransactions, ...newTrx, ...newAcountTrx];
      // totalTrx = await rebuildDataCoinbase(totalTrx, 'coinbase');
      console.log('lenght', allTransactions.length);
      // localStorage.setItem('transactions-coinbase', JSON.stringify(allTransactions));
      return allTransactions;


    case 'no-update':
      // currentTransactions = await rebuildDataCoinbase(currentTransactions, 'coinbase');
      // allTransactions = await postProcess(allTransactions);
      if (makePostProcess) {
        allTransactions = await postProcess(allTransactions);
      }

      return allTransactions;

    default:
      return allTransactions;

  }
}


export default proccesTransactionCoinbase;