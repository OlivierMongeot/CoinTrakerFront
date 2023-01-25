
const rebuildGateIoData = async (transactions: [], type: string): [] => {
  let index = 0;

  switch (type) {
    case 'deposits':

      transactions = transactions.filter(element => element.currency !== 'USDTEST')
      console.log('rebuild Deposit GateIO', transactions)

      while (index < transactions.length) {

        transactions[index].exchange = 'gateio'
        if (transactions[index].currency === 'POINT') {
          transactions[index].id = transactions[index].txid + transactions[index].timestamp;
          transactions[index].id_transaction = transactions[index].txid + transactions[index].timestamp;
          transactions[index].native_amount = { amount: null, currency: null };

        } else {

          transactions[index].id = transactions[index].txid;
          transactions[index].id_transaction = transactions[index].txid;
          transactions[index].native_amount = { amount: transactions[index].amount, currency: transactions[index].currency };
        }

        transactions[index].created_at = parseInt(transactions[index].timestamp) * 1000;

        transactions[index].transaction = 'deposits';

        transactions[index].info = {
          native_currency: transactions[index].native_amount.currency,
          address: transactions[index]?.address,
          blockchain: transactions[index]?.chain,
          memo: transactions[index]?.memo,
          idTx: transactions[index]?.txid,
          // remark: transactions[index]?.remark,
          type: 'deposits',
          // fee: transactions[index]?.fee,
          status: transactions[index]?.status,
          currency: transactions[index].currency
        }
        transactions[index].entry = {
          amount: transactions[index].amount,
          currency: transactions[index].currency,
          urlLogo: transactions[index].urlLogo
        }
        transactions[index].exit = {
          amount: 0,
          currency: ''
        }

        index++
      }
      console.log(transactions)
      return transactions;

    case 'withdrawals':
      console.log('rebuild Withdraw kucoin')
      index = 0;
      while (index < transactions.length) {

        transactions[index].exchange = 'gateio' // For datagrid
        transactions[index].id = transactions[index].txid;
        transactions[index].id_transaction = transactions[index].txid;
        transactions[index].native_amount = { amount: transactions[index].amount, currency: transactions[index].currency };
        transactions[index].created_at = parseInt(transactions[index].timestamp) * 1000;

        transactions[index].info = {
          currency: transactions[index].currency,
          address: transactions[index]?.address,
          blockchain: transactions[index]?.chain,
          memo: transactions[index]?.memo,
          idTx: transactions[index]?.txid,
          type: 'withdrawals',
          fee: transactions[index]?.fee,
          feeCurrency: transactions[index].chain,
          status: transactions[index]?.status,
          native_currency: transactions[index].native_amount.currency
        }

        transactions[index].exit = {
          amount: transactions[index].amount,
          currency: transactions[index].currency,
          urlLogo: transactions[index].urlLogo
        }
        transactions[index].entry = {
          amount: 0,
          currency: ''
        }

        transactions[index].native_amount = { amount: transactions[index].amount, currency: transactions[index].currency };
        transactions[index].transaction = 'withdrawals'
        index++;
      }
      return transactions;

    case 'trades':
      console.log('Rebuild Gateio TRADE')
      index = 0;

      transactions = transactions.filter(transaction => transaction.status !== 'cancelled')

      while (index < transactions.length) {

        transactions[index].exchange = 'gateio'
        let currencyTab = transactions[index].currencyPair.split('_');

        transactions[index].created_at = transactions[index].createTimeMs;
        transactions[index].id_transaction = transactions[index].id
        let fee = null
        let feeCurrency = null
        if (transactions[index]?.fee && parseFloat(transactions[index].fee) > 0) {
          fee = transactions[index].fee
          feeCurrency = transactions[index].feeCurrency
        } else if (transactions[index]?.gtFee && parseFloat(transactions[index].gtFee) > 0) {
          fee = transactions[index].gtFee
          feeCurrency = 'GT'
        } else {
          fee = transactions[index].pointFee
          feeCurrency = 'POINT'

        }

        if (transactions[index].side === "buy") {

          transactions[index].entry = {
            amount: transactions[index].amount,
            currency: currencyTab[0],
            urlLogo: transactions[index].urlLogo
          }
          transactions[index].exit = {
            amount: transactions[index].filledTotal,
            currency: currencyTab[1],
            urlLogo: ''
          }

        } else {
          transactions[index].entry = {
            amount: transactions[index].filledTotal,
            currency: currencyTab[1],
            urlLogo: ''
          }
          transactions[index].exit = {
            amount: transactions[index].amount,
            currency: currencyTab[0],
            urlLogo: transactions[index].urlLogo
          }

        }

        transactions[index].info = {
          currency: currencyTab[0],
          idTx: transactions[index]?.id,
          type: 'trades',
          fee: fee,
          feeCurrency: feeCurrency,
          status: transactions[index].status,
          side: transactions[index]?.side,
          typeTrade: transactions[index].type,
          usdtPrice: transactions[index].price,
          native_currency: currencyTab[1]
        }


        transactions[index].transaction = 'trades'
        transactions[index].native_amount = { amount: transactions[index].filledTotal, currency: currencyTab[1] }
        transactions[index].currency = currencyTab[0]

        index++;
      }
      return transactions;

    default:
      console.log('NO type for trades kucoin')
      break;
  }

}

export default rebuildGateIoData