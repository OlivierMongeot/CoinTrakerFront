

const rebuildDataKucoin = async (trades) => {
  console.log('Rebuild kucoin TRADE', trades)

  let index = 0;

  while (index < trades.length) {

    trades[index].exchange = 'kucoin'
    trades[index].id = trades[index].tradeId;
    trades[index].created_at = trades[index].createdAt;
    trades[index].info = {

      idTx: trades[index]?.walletTxId,
      idTrx: trades[index]?.counterOrderId,
      type: 'trades',
      fee: trades[index]?.fee,
      status: trades[index].status,
      feeRate: trades[index].feeRate,
      feeCurrency: trades[index].feeCurrency,
      priceOrder: trades[index].price,
      side: trades[index].side,
      typeTrade: trades[index].type,
    }

    let currencyTab = trades[index].symbol.split('-');

    if (trades[index].side === "buy") {

      trades[index].entry = {
        amount: trades[index].size,
        currency: currencyTab[0],
        urlLogo: trades[index].urlLogo
      }
      trades[index].exit = {
        amount: trades[index].funds,
        currency: currencyTab[1],
        urlLogo: ''
      }

    } else {
      trades[index].entry = {
        amount: trades[index].funds,
        currency: currencyTab[1],
        urlLogo: ''
      }
      trades[index].exit = {
        amount: trades[index].size,
        currency: currencyTab[0],
        urlLogo: trades[index].urlLogo
      }

    }

    trades[index].transaction = 'trade'
    trades[index].native_amount = { amount: trades[index].funds, currency: currencyTab[1] }
    trades[index].currency = currencyTab[0]
    // trades[index].date = getSimpleDate(trades[index].createdAt)
    delete trades[index].counterOrderId
    delete trades[index].funds
    delete trades[index].side
    delete trades[index].size
    delete trades[index].forceTaker
    delete trades[index].symbol
    delete trades[index].updated_at
    delete trades[index].type
    delete trades[index].fee
    delete trades[index].status
    delete trades[index].feeRate
    delete trades[index].feeCurrency
    delete trades[index].price
    delete trades[index].side
    delete trades[index].tradetype
    delete trades[index].tradeId
    delete trades[index].chain
    index++;
  }
  return trades;
}

export default rebuildDataKucoin