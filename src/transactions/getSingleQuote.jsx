import { toast } from "react-toastify";
import getFiatValue from "../helpers/getFiatValue";
import getSimpleDate from "../helpers/getSimpleDate";



const getSingleQuote = async (transaction, prevTransaction) => {

  console.log('Get Single quote ', transaction)
  // console.log('Get Single prevTransaction quote ', prevTransaction)
  let currency = null
  let date = getSimpleDate(transaction.created_at)
  let amount = null

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
    case 'gateio':
      amount = transaction.native_amount.amount
      currency = transaction.native_amount.currency
      break

    default:
      break;
  }



  if (prevTransaction !== null
    && getSimpleDate(transaction.created_at) === getSimpleDate(prevTransaction.created_at)
    && transaction.native_amount.currency === prevTransaction.native_amount.currency
    && parseFloat(prevTransaction.native_amount.amount) > 0) {

    toast('get last quotation')
    console.log('Get last devise')
    let prevDevises = prevTransaction?.quote_transaction.devises;
    if (prevDevises) {
      transaction.quote_transaction = { devises: prevDevises, amount: amount, currency: currency };
    } else {
      throw Error('No quotation')
    }
    let itemInDollarPrice = amount * prevTransaction.quote_transaction.devises.usd
    let itemInEuroPrice = amount * prevTransaction.quote_transaction.devises.eur
    transaction.info.dollarPrice = itemInDollarPrice / transaction.native_amount.amount
    transaction.info.euroPrice = itemInEuroPrice / transaction.native_amount.amount
    return transaction
  }
  else {
    console.log('Get new devise')
    // Calcul new data 
    let quoteFiat = null;
    switch (currency) {
      case 'USD':
        // console.log('quote Fiat 1 usd === 1 usdt')
        quoteFiat = await getFiatValue('USDT', date);
        for (let element in quoteFiat) {
          quoteFiat[element] = quoteFiat[element] / quoteFiat["usd"]
        }
        break;
      default:
        // console.log('Get quote Fiat for ', currency, ' & date ', date)
        quoteFiat = await getFiatValue(currency, date);
        break;
    }

    console.log('Set Quote fiat for ' + currency + ' / ' + transaction.exchange, quoteFiat)

    transaction.quote_transaction = {
      amount: amount,
      currency: currency,
      devises: quoteFiat
    }


    let itemInDollarPrice = amount * quoteFiat.usd
    let itemInEuroPrice = amount * quoteFiat.eur
    transaction.info.itemInDollarPrice = itemInDollarPrice
    transaction.info.itemInEuroPrice = itemInEuroPrice
    transaction.info.dollarPrice = itemInDollarPrice / transaction.native_amount.amount
    transaction.info.euroPrice = itemInEuroPrice / transaction.native_amount.amount

    return transaction

  }
}

export default getSingleQuote