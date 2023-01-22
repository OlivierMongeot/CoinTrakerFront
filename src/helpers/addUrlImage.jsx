
import getIdsCMC from '../api/getIdsCMC';

const addUrlImage = async (transactions, exchange, type) => {
  console.log('add Url image', exchange, transactions)

  const seturlLogo = (tokenCode, tokenId) => {

    if (tokenCode === 'ETH2') {
      return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
    }
    else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }
  }

  const cmcTokensList = await getIdsCMC();

  for (let i = 0; i < transactions.length; i++) {
    let currency = null;
    cmcTokensList.filter(token => {
      switch (exchange) {
        case 'kucoin':

          if (type === 'transactions') {
            currency = transactions[i].symbol.split('-');
            if (token.symbol.toLowerCase() === currency[0].toLowerCase()) {
              transactions[i].urlLogo = seturlLogo(token.symbol, token.id);
            }

          } else {
            currency = transactions[i].currency;
            if (token.symbol.toLowerCase() === currency.toLowerCase()) {
              transactions[i].urlLogo = seturlLogo(token.symbol, token.id);
            }
          }

          return token.symbol.toLowerCase() === currency[0].toLowerCase();

        case 'coinbase':
          if (token.symbol.toUpperCase() === transactions[i].amount.currency.toUpperCase()) {
            console.log('MATCH token', token.symbol.toLowerCase())
            transactions[i].urlLogo = seturlLogo(token.symbol, token.id);
          }
          return token.symbol.toUpperCase() === transactions[i].amount.currency.toUpperCase();



        default:
          return token.symbol.toLowerCase() === transactions[i].amount.currency.toLowerCase();
      }
    })
  }
  return transactions;
}

export default addUrlImage;