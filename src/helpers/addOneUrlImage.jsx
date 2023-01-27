
import getIdsCMC from '../api/getIdsCMC';
import addLogoServer from './addLogoServer';

const addOneUrlImage = async (transaction, exchange, type, userData) => {

  console.log('add Url image', exchange, transaction)

  const seturlLogo = (tokenCode, tokenId, userData) => {
    // add Token to server 
    addLogoServer(tokenId, tokenCode, userData)
    if (tokenCode === 'ETH2') {
      return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
    }
    else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }
  }

  const cmcTokensList = await getIdsCMC();

  // for (let i = 0; i < transactions.length; i++) {

  cmcTokensList.filter(token => {

    switch (exchange) {

      case 'kucoin':
        let currency = null;
        if (type === 'transactions') {
          currency = transaction.symbol.split('-');
          if (token.symbol.toLowerCase() === currency[0].toLowerCase()) {
            transaction.urlLogo = seturlLogo(token.symbol, token.id, userData);
          }
        } else {
          currency = transaction.currency;
          if (token.symbol.toLowerCase() === currency.toLowerCase()) {
            transaction.urlLogo = seturlLogo(token.symbol, token.id, userData);
          }
        }
        return token.symbol.toLowerCase() === currency[0].toLowerCase();

      case 'coinbase':

        if (token.symbol.toUpperCase() === transaction.amount.currency.toUpperCase()) {
          console.log('MATCH token', token.symbol.toLowerCase())
          transaction.urlLogo = seturlLogo(token.symbol, token.id, userData);
        }
        return token.symbol.toUpperCase() === transaction.amount.currency.toUpperCase();


      case 'gateio':
        // console.log('gateIo Filter')

        let currenc = null
        if (transaction?.currencyPair) {
          currenc = transaction?.currencyPair.split('_')
          currenc = currenc[0]
        } else {
          currenc = transaction?.currency
        }

        if (token.symbol.toUpperCase() === currenc.toUpperCase()) {
          transaction.urlLogo = seturlLogo(token.symbol, token.id, userData);
        }
        return token.symbol.toUpperCase() === currenc.toUpperCase();

      default:
        return token.symbol.toLowerCase() === transaction.currency.toLowerCase();
    }
  })
  // }
  return transaction;
}

export default addOneUrlImage;