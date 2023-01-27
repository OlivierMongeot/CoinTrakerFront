
const rebuildOneGateIoData = async (transaction: [], type: string): [] => {

  switch (type) {
    case 'deposits':

      console.log('Rebuild Deposit GateIO', transaction)

      transaction.exchange = 'gateio'
      transaction.created_at = parseInt(transaction.timestamp) * 1000;
      transaction.transaction = 'deposits';

      if (transaction.currency === 'POINT') {
        transaction.id = transaction.txid + transaction.timestamp;
        transaction.id_transaction = transaction.txid + transaction.timestamp;
        transaction.native_amount = { amount: transaction.amount, currency: 'POINT' };
      } else {
        transaction.id = transaction.txid;
        transaction.id_transaction = transaction.txid;
        transaction.native_amount = { amount: transaction.amount, currency: transaction.currency };
      }

      transaction.info = {
        native_currency: transaction.native_amount.currency,
        address: transaction?.address,
        blockchain: transaction?.chain,
        memo: transaction?.memo,
        idTx: transaction?.txid,
        type: 'deposits',
        status: transaction?.status,
        currency: transaction.currency
      }
      transaction.entry = {
        amount: transaction.amount,
        currency: transaction.currency,
        urlLogo: transaction.urlLogo
      }
      transaction.exit = {
        amount: 0,
        currency: ''
      }
      return transaction;


    case 'withdrawals':
      console.log('rebuild Withdraw kucoin', transaction)
      transaction.exchange = 'gateio' // For datagrid
      transaction.id = transaction.txid;
      transaction.id_transaction = transaction.txid;
      transaction.native_amount = { amount: transaction.amount, currency: transaction.currency };
      transaction.created_at = parseInt(transaction.timestamp) * 1000;
      transaction.info = {
        currency: transaction.currency,
        address: transaction?.address,
        blockchain: transaction?.chain,
        memo: transaction?.memo,
        idTx: transaction?.txid,
        type: 'withdrawals',
        fee: transaction?.fee,
        feeCurrency: transaction.chain,
        status: transaction?.status,
        native_currency: transaction.native_amount.currency
      }
      transaction.exit = {
        amount: transaction.amount,
        currency: transaction.currency,
        urlLogo: transaction.urlLogo
      }
      transaction.entry = {
        amount: 0,
        currency: ''
      }
      transaction.native_amount = { amount: transaction.amount, currency: transaction.currency };
      transaction.transaction = 'withdrawals'
      return transaction;




    case 'trades':
      console.log('Rebuild Gateio TRADE')
      transaction.exchange = 'gateio'
      let currencyTab = transaction.currencyPair.split('_');

      transaction.created_at = transaction.createTimeMs;
      transaction.id_transaction = transaction.id
      let fee = null
      let feeCurrency = null
      if (transaction?.fee && parseFloat(transaction.fee) > 0) {
        fee = transaction.fee
        feeCurrency = transaction.feeCurrency
      } else if (transaction?.gtFee && parseFloat(transaction.gtFee) > 0) {
        fee = transaction.gtFee
        feeCurrency = 'GT'
      } else {
        fee = transaction.pointFee
        feeCurrency = 'POINT'

      }
      if (transaction.side === "buy") {
        transaction.entry = {
          amount: transaction.amount,
          currency: currencyTab[0],
          urlLogo: transaction.urlLogo
        }
        transaction.exit = {
          amount: transaction.filledTotal,
          currency: currencyTab[1],
          urlLogo: ''
        }

      } else {
        transaction.entry = {
          amount: transaction.filledTotal,
          currency: currencyTab[1],
          urlLogo: ''
        }
        transaction.exit = {
          amount: transaction.amount,
          currency: currencyTab[0],
          urlLogo: transaction.urlLogo
        }

      }
      transaction.info = {
        currency: currencyTab[0],
        idTx: transaction?.id,
        type: 'trades',
        fee: fee,
        feeCurrency: feeCurrency,
        status: transaction.status,
        side: transaction?.side,
        typeTrade: transaction.type,
        usdtPrice: transaction.price,
        native_currency: currencyTab[1]
      }
      transaction.transaction = 'trades'
      transaction.native_amount = { amount: transaction.filledTotal, currency: currencyTab[1] }
      transaction.currency = currencyTab[0]
      return transaction;

    default:
      console.log('No type for trades kucoin')
      break;
  }
}

export default rebuildOneGateIoData