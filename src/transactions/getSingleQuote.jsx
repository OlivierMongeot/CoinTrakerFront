import getFiatValue from "../helpers/getFiatValue";
import getSimpleDate from "../helpers/getSimpleDate";
import updateTransactionDB from "./updateTransactionDB";



const getSingleQuote = async (transaction, userData) => {

  // console.log('Get Single quote ', transaction)
  // transaction = transaction[0]
  let currency = null
  let date = getSimpleDate(transaction.created_at)
  let amount = null

  if (!transaction.quote_transaction || transaction.quote_transaction.devises === null) {
    console.log('Get Single quote for ', transaction)

    switch (transaction.exchange) {

      case 'kucoin':
        amount = transaction.native_amount.amount
        currency = transaction.native_amount.currency
        break

      case 'coinbase':

        if (parseFloat(transaction.native_amount.amount) > 0) {
          amount = transaction.native_amount.amount
          currency = transaction.native_amount.currency
        } else {
          if (parseFloat(transaction.entry.amount) > 0) {
            amount = parseFloat(transaction.entry.amount)
            currency = transaction.entry.currency
          } else {
            amount = parseFloat(transaction.exit.amount)
            currency = transaction.exit.currency
          }
        }

        break;

      default:
        break;
    }

    // // Part 2 : gestion du token 
    // if (
    // index > 0
    // && getSimpleDate(transactions[index - 1].created_at) === date
    // && transactions[index].native_amount.currency === transactions[index - 1].native_amount.currency
    // && parseFloat(transactions[index].native_amount.amount) !== 0) {

    // console.log('take prev data quotation')

    // let prevDevises = transactions[index - 1]?.quote_transaction.devises;
    // if (prevDevises) {
    //   transactions[index].quote_transaction = { devises: prevDevises, amount: amount, currency: currency };
    // }

    // } else {
    // 
    // console.log('id trx ', transactions[index].id)
    // currency = transactions[index].native_amount.currency;

    let quoteFiat = null;
    switch (currency) {
      case 'USD':
        console.log('Hack quote Fiat for usd')
        quoteFiat = await getFiatValue('USDT', date);
        for (let element in quoteFiat) {
          quoteFiat[element] = quoteFiat[element] / quoteFiat["usd"]
        }
        break;

      default:
        console.log('Get quote Fiat for ', currency, ' & date ', date)
        quoteFiat = await getFiatValue(currency, date);
        break;
    }

    console.log('Quote fiat for ' + currency + ' / ' + transaction.exchange, quoteFiat)

    transaction.quote_transaction = {
      amount: amount,
      currency: currency,
      devises: quoteFiat
    }
    // updateTransactionDB(transaction.info.idTx, transaction.quote_transaction, userData)
    return transaction
  } else {
    return null
  }

  // updadate DB transaction quote 




}

// }

export default getSingleQuote