
import getIdsCMC from '../api/getIdsCMC';

const addUrlImage = async (data, exchange) => {
  console.log('add Url image', exchange)

  const seturlLogo = (tokenCode, tokenId) => {
    if (tokenCode === 'ETH2') {
      return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
    }
    else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }
  }

  const cmcTokensList = await getIdsCMC();

  for (let i = 0; i < data.length; i++) {
    cmcTokensList.filter(token => {
      switch (exchange) {
        case 'kucoin':
          let currency = data[i].symbol.split('-');
          if (token.symbol.toLowerCase() === currency[0].toLowerCase()) {
            data[i].urlLogo = seturlLogo(token.symbol, token.id);
          }
          return token.symbol.toLowerCase() === currency[0].toLowerCase();

        case 'coinbase':
          if (token.symbol.toLowerCase() === data[i].amount.currency.toLowerCase()) {
            data[i].urlLogo = seturlLogo(token.symbol, token.id);
          }
          return token.symbol.toLowerCase() === data[i].amount.currency.toLowerCase();

        default:
          return token.symbol.toLowerCase() === data[i].amount.currency.toLowerCase();
      }
    })
  }
  return data;
}

export default addUrlImage;