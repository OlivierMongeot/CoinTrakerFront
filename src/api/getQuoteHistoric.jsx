
import getSimpleDate from '../helpers/getSimpleDate';
import getFiatValue from '../helpers/getFiatValue';

const getQuoteHistoric = async (transactions, index) => {


  let currency = null;
  let date = getSimpleDate(transactions[index].createdAt);
  let currencyUsed = null;
  // Pas de quote trx 
  if (!transactions[index].quote_transaction) {
    // on check si dejé cherché avant
    console.log('Pas de trx pour ', transactions[index].amount.currency)
    if (index > 0 && getSimpleDate(transactions[index - 1].createdAt) === date) {

      let prevDevises = transactions[index - 1].quote_transaction.devises;
      if (prevDevises) {
        transactions[index].quote_transaction = { devises: prevDevises, amount: transactions[index].native_amount.amount };
      } else {
        console.log('error pas de prev devises')
      }

    } else {

      console.log('id trx ', transactions[index].id)
      currency = transactions[index].native_amount.currency;

      if (currency === 'USD') {
        currencyUsed = 'USDT';
      } else {
        currencyUsed = currency
      }
      let quoteFiat = await getFiatValue(currencyUsed, date);
      console.log('quote fiat Coinbase', quoteFiat)

      if (currency === 'USD') {
        // hack : map the date array because coinGeckon don't give USD/EUR quote 
        for (let element in quoteFiat) {
          // console.log(element)
          // console.log(quoteFiat[element])
          quoteFiat[element] = quoteFiat[element] / quoteFiat["usd"]
        }
      }

      console.log('quote fiat after', quoteFiat)
      transactions[index].quote_transaction = {
        amount: transactions[index].native_amount.amount,
        devises: quoteFiat
      }

    }




  }

  return transactions;
}


export default getQuoteHistoric;