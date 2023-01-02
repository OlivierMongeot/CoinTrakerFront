
import config from '../config';
import { toast } from 'react-toastify';
import addUrlImage from '../helpers/addUrlImage'
import eraseDoublon from '../helpers/eraseDoublon';
import getLastestTransactionsCoinbase from '../helpers/getLastestTransactionsCoinbase';

const proccesTransactionCoinbase = async (mode, userData) => {


  const postProcess = async (trx, exchange) => {

    const rebuildDataCoinbase = async (data, exchange) => {

      console.log('rebuild data');
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
      while (index < data.length) {

        if (data[index].type === 'buy') {
          const data_buy = await getDataBuy(data[index].buy.resource_path, userData);
          console.log('Buy data', data_buy.data);
          data[index].data_buy = data_buy.data;
        }
        index++;
      }


      data.forEach(element => {

        element.exchange = exchange;
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
        element.smartTitle = { info: element.title, type: element.smartType }
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

        // Supprime les sorties du wallet sur les cas suivants:
        // !!!! depend des message coinbase !!!! Trouveer une meilleur soluce 
        if ((element.details.subtitle && (element.details.subtitle).includes('De Coinbase')) ||
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
          element.transaction = 'withdraw'

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
            element.transaction = 'withdraw'

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
        if (element.type === "buy") {

          element.exit = {
            amount: element.data_buy.subtotal.amount,
            currency: element.data_buy.subtotal.currency,
            urlLogo: ""
          }
        }
      })

      return data;
    }

    const data = eraseDoublon(trx)
    let result = await addUrlImage(data, exchange)
    // rebuild data for table datagrid
    if (result.length > 0) {
      result = await rebuildDataCoinbase(result, exchange);
      // setTransactions(result);
      localStorage.setItem('transactions-coinbsae', JSON.stringify(result))
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
      console.log('Account Page', accountsPage);
      console.log('Account Page', accountsPage.pagination);
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

  const fetchCurentTransactions = async (lastTrx) => {

    // Boucle sur les accounts activé avec la derbiere trx
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
      console.log(index * 100 / (lastTrx.length) + '%');
    }

    if (transactions.length === 0) {
      toast('No new transaction found')
    }
    // setPourcentLoad(0);
    return transactions;
  }

  // setIsLoading('');
  const accountSaved = JSON.parse(localStorage.getItem('accounts-coinbase'));
  let accounts = []
  let currentTransactions = []
  let newTransactions = []
  let restartAllFetch = false;

  if ((accountSaved && !accountSaved.length > 0) || (mode === 'force')) {
    accounts = await fetchAllAccountCoinbase();
  } else {
    accounts = accountSaved;
  }

  let trxSaved = JSON.parse(localStorage.getItem('transactions-coinbase'));

  // trxSaved = await postProcess(trxSaved, "coinbase");

  console.log('trx saved', trxSaved)
  if (trxSaved === null || (mode === 'force')) {
    console.log('no trx in ls : restart all')
    newTransactions = await fetchAllTransactions(accounts);
    restartAllFetch = true;
  } else {
    currentTransactions = trxSaved;
  }

  let totalTrx = []

  console.log('mode ', mode);

  switch (mode) {
    case 'quick':
      if (!restartAllFetch) {
        let lastTrx = getLastestTransactionsCoinbase(currentTransactions);
        // console.log('last TRX', lastTrx);
        let updatedTrx = await fetchCurentTransactions(lastTrx);

        if (updatedTrx.length > 0) {
          updatedTrx = await postProcess(updatedTrx, "coinbase");
        }

        console.log('New trx : ', updatedTrx);
        totalTrx = [...currentTransactions, ...updatedTrx];
        localStorage.setItem('transactions-coinbase', JSON.stringify(totalTrx));
        return totalTrx;
      } else {
        newTransactions = await postProcess(newTransactions, "coinbase");
        localStorage.setItem('transactions-coinbase', JSON.stringify(newTransactions));
        return newTransactions
      }

    case 'no-update':
      return currentTransactions;

    default:
      return currentTransactions;

  }


}


export default proccesTransactionCoinbase;