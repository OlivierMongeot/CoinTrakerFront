
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import eraseDoublon from '../helpers/eraseDoublon';
import getLastestTransactionsCoinbase from '../helpers/getLastestTransactionsCoinbase';

const proccesTransactionCoinbase = async (mode, userData) => {

  console.log('process Coinbase trx ')


  const rebuildDataCoinbase = async (transactions) => {

    console.log('rebuild transactions', transactions.length);

    function getSmartType(type, amount, description) {

      switch (type) {
        case 'send':
          if (description === 'Earn Task') {
            return 'Earn'
          }
          if (parseFloat(amount) < 0) {
            return 'Withdraw'
          } else {
            return 'Deposit'
          }

        case 'trade':
          return 'Swap'

        case 'interest':
          return 'Interest'
        case 'inflation_reward':
          return 'Reward'

        case 'reward':
          return 'Inflation reward'

        case 'staking_reward':
          return 'Staking Reward'

        case 'vault_withdrawal':
          return 'Withdraw externe'

        case 'advanced_trade_fill':
          return 'Trade'

        case 'buy':
          return 'Buy'

        case 'fiat_deposit':
          return 'Deposit FIAT'

        case 'transfer':
          return 'Transfer'

        default:
          console.log('unknow type ', type, amount)
          return 'unknow Type'

      }
    }

    async function getDataBuy(path, userData) {

      const data = {
        email: userData.email,
        exchange: 'coinbase',
        path: path
      };

      const response = await fetch('http://' + config.urlServer + '/coinbase/buy', {
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
      // const buy = await response.json();
      return await response.json();
    }


    // add euro data for buy 
    let index = 0;
    let idDataBuyArray = [];
    while (index < transactions.length) {

      if (transactions[index].type === 'buy'
        //  && !transactions[index].data_buy
        && !transactions[index].hasOwnProperty('data_buy')) {

        // const data_buy = { data: { usd: 1 } };
        const data_buy = await getDataBuy(transactions[index].buy.resource_path, userData);
        console.log('Buy data', data_buy.data);
        transactions[index].data_buy = data_buy.data;

        if (idDataBuyArray.includes(data_buy.data.id)) {
          // déja entre donc delete elem
          console.log('delete a faire', transactions[index])

        } else {
          idDataBuyArray.push(data_buy.data.id)
        }
        console.log(idDataBuyArray)

      } else if (transactions[index].type === 'buy') {
        console.log('Trx Buy avec data buy déjà entré')
      }
      index++;
    }


    transactions.forEach(element => {

      element.exchange = 'coinbase';
      element.createdAt = new Date(element.created_at).getTime();

      if (element.details.subtitle !== null) {
        element.title = element.details.title + ' ' + (element.details?.subtitle).toLowerCase();
      } else {
        element.title = element.details.title;
      }
      if (element.details.header !== null) {
        element.title = element.title + ' (' + element.details.header + ')';
      }
      element.title = element.title + ' | ID: ' + element.id;



      element.smartType = getSmartType(element.type, element.amount.amount, element.description);
      // element.smartTitle = { info: element.title, type: element.smartType }
      element.token = element.amount.currency;

      if (parseFloat(element.amount.amount) > 0) {

        element.entry = {
          amount: element.amount.amount,
          currency: element.amount.currency,
          urlLogo: element.urlLogo
          // urlLogo: ''
        }
        element.exit = {
          amount: element.native_amount.amount,
          currency: element.native_amount.currency
        }
        element.transaction = 'trade'
      } else {
        element.entry = {
          amount: -element.native_amount.amount,
          currency: element.native_amount.currency,
        }
        element.exit = {
          amount: -element.amount.amount,
          currency: element.amount.currency,
          urlLogo: element.urlLogo
          // urlLogo: ''
        }
        element.transaction = 'trade'
      }

      if (
        (element.type === "fiat_deposit")
        || (element.type === "interest")
        || (element.type === 'reward')
        || (element.type === 'inflation_reward')
        || (element.type === 'staking_reward')
      ) {
        element.exit = { amount: 0, currency: '' };
        element.transaction = 'deposit';
      }

      if ((
        element.description && (element.description).includes('Earn'))
        || (element.details.subtitle && (element.details.subtitle).includes('Earn'))
      ) {
        element.exit = { amount: 0, currency: '' };
        element.transaction = 'deposit';
        element.smartType = 'Earn'
      }

      if (element.type === 'send' && parseFloat(element.amount.amount) < 0) {
        element.entry = {
          amount: 0,
          currency: ''
        }
        element.transaction = 'withdrawals'

      } else if (element.type === 'send') {
        element.exit = {
          amount: 0,
          currency: ''
        }
        element.transaction = 'deposit'
      }

      if (element.type === "vault_withdrawal" || element.type === "transfer") {
        if (parseFloat(element.amount.amount) < 0) {
          // Retrait sur wallet extern
          element.entry = {
            amount: 0,
            currency: ''
          }
          element.transaction = 'withdrawals'

        } else {
          // depot du wallet externe 
          element.exit = {
            amount: 0,
            currency: ''
          }
          element.transaction = 'deposit'
        }
      }

      // TODO 
      element.modal = {
        id_transaction: element.id,
        title: element.details.title,
        subtitle: element.details.subtitle,
        header: element.details.header,
        fee: element?.data_buy?.fee ? element?.data_buy?.fee : null,
        subtotal: element?.data_buy?.subtotal ? element?.data_buy?.subtotal : null,
        total: element?.data_buy?.total ? element?.data_buy?.total : null,
        unit_price: element?.data_buy?.unit_price ? element?.data_buy?.unit_price : null,
      }
    })


    return transactions;
  }

  const postProcess = async (transactions) => {

    const data = eraseDoublon(transactions)
    let result = await addUrlImage(data, 'coinbase')
    // rebuild data for table datagrid
    if (result.length > 0) {

      result = await rebuildDataCoinbase(result);
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

  async function fetchAllTransacPath(path, searchDirection) {

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

    // let path = '/v2/accounts/' + accountId + "/transactions";
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
        const data = await fetchAllTransacPath(path, 'next');
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
        const data = await fetchAllTransacPath(path, 'previous');
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

  // const trxSaved = JSON.parse(localStorage.getItem('transactions-coinbase'));


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


      const lastTrx = getLastestTransactionsCoinbase(allTransactions);
      console.log('Last current TRX', lastTrx);
      console.log('Last current TRX lenght', lastTrx.length);

      let newAccount = []
      let newTrx = [];
      let newAcountTrx = [];
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

      newTrx = await fetchNewTransactions(lastTrx);

      if (newTrx.length > 0) {
        console.log('New trx : ', newTrx);
        toast("Nouvelle transaction Coinbase trouvée")
        newTrx = await postProcess(newTrx);
      } else {
        toast("Pas de nouvelle transaction Coinbase")
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