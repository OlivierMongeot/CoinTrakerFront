
import config from "../../config";

const rebuildDataCoinbase = async (transactions, userData) => {

  console.log('rebuild transactions', transactions.length);

  // function getSmartType(type, amount, description) {

  //   switch (type) {
  //     case 'send':
  //       if (description === 'Earn Task') {
  //         return 'Earn'
  //       }
  //       if (parseFloat(amount) < 0) {
  //         return 'Withdraw'
  //       } else {
  //         return 'Deposit'
  //       }

  //     case 'trade':
  //       return 'Swap'

  //     case 'interest':
  //       return 'Interest'
  //     case 'inflation_reward':
  //       return 'Reward'

  //     case 'reward':
  //       return 'Inflation reward'

  //     case 'staking_reward':
  //       return 'Staking Reward'

  //     case 'vault_withdrawal':
  //       return 'Withdraw externe'

  //     case 'advanced_trade_fill':
  //       return 'Trade'

  //     case 'buy':
  //       return 'Buy'

  //     case 'fiat_deposit':
  //       return 'Deposit FIAT'

  //     case 'transfer':
  //       return 'Transfer'

  //     default:
  //       console.log('unknow type ', type, amount)
  //       return 'unknow Type'

  //   }
  // }

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
    // if (element.details.subtitle !== null) {
    //   element.title = element.details.title + ' ' + (element.details?.subtitle).toLowerCase();
    // } else {
    //   element.title = element.details.title;
    // }
    // if (element.details.header !== null) {
    //   element.title = element.title + ' (' + element.details.header + ')';
    // }
    // element.title = element.title + ' | ID: ' + element.id;



    // element.smartType = getSmartType(element.type, element.amount.amount, element.description);
    // element.smartTitle = { info: element.title, type: element.smartType }
    // element.token = element.amount.currency;

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
    element.currency = element.amount.currency


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
      // element.smartType = 'Earn'
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

    element.info = {
      // address: element?.address,
      // blockchain: element?.chain,
      memo: element?.type,
      idTx: element.id,
      remark: element?.title + element.subtitle ? element.subtitle : ' ' + element.header ? element.header : ' ',
      type: element.transaction,
      // fee: transactions[index]?.fee,
      status: element?.status,
      resource_path: element.resource_path
    }
  })


  return transactions;
}

export default rebuildDataCoinbase