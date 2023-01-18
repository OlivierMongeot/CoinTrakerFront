import getSimpleDate from '../helpers/getSimpleDate';
import getFiatValue from '../helpers/getFiatValue';


const getQuote = async (transactions) => {
  // console.log('Fetch Quote')

  let index = 0;

  while (index < transactions.length
    && index < 100000
  ) {

    let currency = null;
    let date = getSimpleDate(transactions[index].created_at);

    if (!transactions[index].quote_transaction || transactions[index].quote_transaction.devises === null) {
      console.log('Transactions n°' + index, transactions[index])
      // console.log('Get quotation for ', transactions[index].native_amount.currency)
      let amount = null;
      switch (transactions[index].exchange) {

        case 'kucoin':
          amount = transactions[index].native_amount.amount
          currency = transactions[index].native_amount.currency
          break
        case 'coinbase':
          const nativeAmount = parseFloat(transactions[index].native_amount.amount);
          if (nativeAmount !== 0) {
            amount = transactions[index].native_amount.amount
            currency = transactions[index].native_amount.currency
          } else {
            amount = transactions[index].amount.amount
            currency = transactions[index].amount.currency
          }
          break;

        default:
          break;
      }

      // // Part 2 : gestion du token 
      if (index > 0
        && getSimpleDate(transactions[index - 1].created_at) === date

        && transactions[index].native_amount.currency === transactions[index - 1].native_amount.currency

        && parseFloat(transactions[index].native_amount.amount) !== 0) {

        console.log('take prev data quotation')

        let prevDevises = transactions[index - 1]?.quote_transaction.devises;
        if (prevDevises) {
          transactions[index].quote_transaction = { devises: prevDevises, amount: amount, currency: currency };
        }

      } else {

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

        console.log('Quote fiat for ' + currency + ' / ' + transactions[index].exchange, quoteFiat)
        transactions[index].quote_transaction = {};
        transactions[index].quote_transaction = {
          amount: amount,
          currency: currency,
          devises: quoteFiat
        }

      }

    }
    index++;
  }

  return transactions
}

export default getQuote