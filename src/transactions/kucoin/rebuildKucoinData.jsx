
const rebuildKucoinData = async (transactions: [], type: string): [] => {

  switch (type) {
    case 'deposit':
      console.log('rebuild Deposit kucoin', transactions)
      let index = 0;
      while (index < transactions.length) {
        transactions[index].exchange = 'kucoin'
        transactions[index].id = transactions[index].walletTxId;
        transactions[index].created_at = transactions[index].createdAt;
        transactions[index].native_amount = { amount: transactions[index].amount, currency: transactions[index].currency };
        transactions[index].transaction = 'deposit';
        transactions[index].info = {
          address: transactions[index]?.address,
          blockchain: transactions[index]?.chain,
          memo: transactions[index]?.memo,
          idTx: transactions[index]?.walletTxId,
          remark: transactions[index]?.remark,
          type: 'deposit',
          fee: transactions[index]?.fee,
          status: transactions[index]?.status
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
        delete transactions[index].arrears
        delete transactions[index].updatedAt
        delete transactions[index].isInner
        delete transactions[index].walletTxId;
        delete transactions[index]?.remark;
        delete transactions[index].createdAt;
        delete transactions[index].chain;
        delete transactions[index].fee;
        delete transactions[index]?.memo;
        delete transactions[index].status;
        delete transactions[index].urlLogo;
        delete transactions[index].address;
        delete transactions[index].amount
        index++
      }
      console.log(transactions)
      return transactions;

    case 'withdrawals':
      console.log('rebuild Withdraw kucoin')
      index = 0;
      while (index < transactions.length) {

        transactions[index].exchange = 'kucoin' // For datagrid
        transactions[index].id = transactions[index].walletTxId; // For datagrid
        transactions[index].created_at = transactions[index].createdAt // For datagrid
        transactions[index].info = {
          address: transactions[index].address,
          blockchain: transactions[index].chain,
          memo: transactions[index]?.memo,
          idTx: transactions[index]?.walletTxId,
          fee: transactions[index].fee,
          remark: transactions[index].remark,
          type: 'withdrawals',
          status: transactions[index].status
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

        delete transactions[index].isInner
        delete transactions[index].updatedAt
        delete transactions[index].updated_at
        delete transactions[index].walletTxId
        delete transactions[index].createdAt;
        delete transactions[index].chain;
        delete transactions[index].fee;
        delete transactions[index].memo;
        delete transactions[index]?.remark;
        delete transactions[index].status;
        delete transactions[index].urlLogo
        delete transactions[index].amount

        index++;
      }
      return transactions;

    case 'trade':
      console.log('Rebuild kucoin TRADE')

      index = 0;

      while (index < transactions.length) {

        transactions[index].exchange = 'kucoin'
        transactions[index].id = transactions[index].tradeId;
        transactions[index].created_at = transactions[index].createdAt;
        transactions[index].info = {

          idTx: transactions[index]?.walletTxId,
          idTrx: transactions[index]?.counterOrderId,
          type: 'trade',
          fee: transactions[index]?.fee,
          status: transactions[index].status,
          feeRate: transactions[index].feeRate,
          feeCurrency: transactions[index].feeCurrency,
          priceOrder: transactions[index].price,
          side: transactions[index].side,
          typeTrade: transactions[index].type,
        }

        let currencyTab = transactions[index].symbol.split('-');

        if (transactions[index].side === "buy") {

          transactions[index].entry = {
            amount: transactions[index].size,
            currency: currencyTab[0],
            urlLogo: transactions[index].urlLogo
          }
          transactions[index].exit = {
            amount: transactions[index].funds,
            currency: currencyTab[1],
            urlLogo: ''
          }

        } else {
          transactions[index].entry = {
            amount: transactions[index].funds,
            currency: currencyTab[1],
            urlLogo: ''
          }
          transactions[index].exit = {
            amount: transactions[index].size,
            currency: currencyTab[0],
            urlLogo: transactions[index].urlLogo
          }

        }

        transactions[index].transaction = 'trade'
        transactions[index].native_amount = { amount: transactions[index].funds, currency: currencyTab[1] }
        transactions[index].currency = currencyTab[0]
        // transactions[index].date = getSimpleDate(transactions[index].createdAt)
        delete transactions[index].counterOrderId
        delete transactions[index].funds
        delete transactions[index].side
        delete transactions[index].size
        delete transactions[index].forceTaker
        delete transactions[index].symbol
        delete transactions[index].updated_at
        delete transactions[index].type
        delete transactions[index].fee
        delete transactions[index].status
        delete transactions[index].feeRate
        delete transactions[index].feeCurrency
        delete transactions[index].price
        delete transactions[index].side
        delete transactions[index].tradetype
        delete transactions[index].tradeId
        delete transactions[index].chain
        index++;
      }
      return transactions;

    default:
      console.log('NO type for trades kucoin')
      break;
  }

}

export default rebuildKucoinData