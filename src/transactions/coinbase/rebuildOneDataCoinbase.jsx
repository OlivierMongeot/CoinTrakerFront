import { type } from "@testing-library/user-event/dist/type";
import config from "../../config";

const rebuildDataCoinbase = async (transactions, userData) => {

  console.log('rebuild transactions', transactions.length);


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
    element.createdAt = element.created_at;
    element.created_at = new Date(element.created_at).getTime();


    if (parseFloat(element.amount.amount) > 0) {

      element.entry = {
        amount: element.amount.amount,
        currency: element.amount.currency,
        urlLogo: element.urlLogo

      }
      element.exit = {
        amount: element.native_amount.amount,
        currency: element.native_amount.currency
      }
      element.transaction = 'trades'

    } else {
      element.entry = {
        amount: -element.native_amount.amount,
        currency: element.native_amount.currency,
      }
      element.exit = {
        amount: -element.amount.amount,
        currency: element.amount.currency,
        urlLogo: element.urlLogo
      }
      element.transaction = 'trades'

    }
    element.currency = element.amount.currency

    switch (element.type) {
      case "fiat_deposit":
      case "interest":
      case "reward":
      case "inflation_reward":
      case "staking_reward":
        element.exit = { amount: 0, currency: '' };
        element.transaction = 'deposits';
        break;


      case 'send':
      case 'vault_withdrawal':
      case 'transfer':
        if (parseFloat(element.amount.amount) < 0) {
          element.entry = {
            amount: 0,
            currency: ''
          }
          element.transaction = 'withdrawals'
        } else {
          element.exit = {
            amount: 0,
            currency: ''
          }
          element.transaction = 'deposits'
        }
        break

      case 'advanced_trade_fill':
      case 'trade':
        element.transaction = 'trades'
        break

      default:
        if (element?.ressource === 'buy') {
          element.transaction = 'buy'
        } else {
          element.transaction = 'unknow'
        }


    }


    // if ((
    //   element.description && (element.description).includes('Earn'))
    //   || (element.details.subtitle && (element.details.subtitle).includes('Earn'))
    // ) {
    //   element.exit = { amount: 0, currency: '' };
    //   element.transaction = 'deposits';
    // }


    element.info = {
      address: element?.address,
      currency: element.currency,
      details: element?.details,
      memo: element?.type,
      idTx: element.id,
      remark: element?.title + element.subtitle ? element.subtitle : ' ' + element.header ? element.header : ' ',
      type: element.transaction,
      fee: element?.fee,
      status: element?.status,
      resource_path: element.resource_path,
      native_currency: element.native_amount.currency,
      usdtPrice: element.native_amount.amount / element.amount.amount
    }
    element.id_transaction = element.id
    element.quote_transaction = null
  })


  return transactions;
}

export default rebuildDataCoinbase