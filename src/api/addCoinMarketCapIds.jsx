
import getIdsCMC from './getIdsCMC';


const seturlLogo = (tokenCode, tokenId) => {
  if (tokenCode === 'ETH2') {
    return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
  } else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }
}

const checkParticularName = (walletElement, token, exchange) => {
  switch (exchange) {
    case 'kucoin':
      if (token.symbol === 'POL') {
        walletElement.urlLogo = seturlLogo(token.symbol, 6297);
        walletElement.name = 'Proof of Liquidity';
      }
      break;

    case 'gateio':
      if (token.symbol === 'POINT') {
        walletElement.urlLogo = seturlLogo(token.symbol, 4269);
        walletElement.name = 'Point';
      }
      break;
    default:
      break;
  }
  return walletElement;
}


const addCoinMarketCapIds = async (wallet, exchange, ip) => {
  console.log('addCoinMarketCapIds', exchange);
  const cmcTokensList = await getIdsCMC(ip);

  for (let i = 0; i < wallet.length; i++) {
    // cherche dans cmcTokensList le token avec le code wallet[i].code pour retrouver le prix live 
    cmcTokensList.filter(token => {

      switch (exchange) {
        case 'kucoin':
          if (token.symbol === wallet[i].currency) {
            wallet[i].idCMC = token.id;
            wallet[i].code = token.symbol;
            wallet[i].timestamp = new Date().getTime();
            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
            wallet[i].name = token.name;
            wallet[i] = checkParticularName(wallet[i], token, exchange);
            wallet[i].exchange = exchange;
          }
          break;

        case 'gateio':
          if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
            if ((wallet[i].available)) {
              wallet[i].balance = parseFloat(wallet[i].available) + parseFloat(wallet[i].locked)
            } else {
              wallet[i].balance = parseFloat(wallet[i].balance)
            }
            wallet[i].idCMC = token.id;
            wallet[i].code = token.symbol;
            wallet[i].timestamp = new Date().getTime();
            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
            wallet[i].name = token.name;
            wallet[i] = checkParticularName(wallet[i], token, exchange);
            wallet[i].exchange = exchange;
          }
          break;

        case 'coinbase':
          if (token.symbol === wallet[i].code) {
            wallet[i].idCMC = token.id;
            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
            wallet[i].balance = wallet[i].amount;
            wallet[i].exchange = exchange;
          }
          break;

        case 'crypto-com':
          if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
            wallet[i].idCMC = token.id;
            wallet[i].name = token.name;
            wallet[i].code = token.symbol;
            wallet[i].timestamp = new Date().getTime();
            wallet[i].exchange = exchange;
          }
          break;

        case 'binance':

          if (token.symbol === wallet[i].currency) {
            wallet[i].idCMC = token.id;
            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
            wallet[i].name = token.name;
            wallet[i].code = token.symbol;
            wallet[i].timestamp = new Date().getTime();
            wallet[i].exchange = exchange;
            wallet[i].balance = wallet[i].balance + wallet[i].locked;
          }
          // console.log(wallet[i])
          break;

        default:
          break;
      }

      return token.symbol.toLowerCase() === wallet[i].currency.toLowerCase();
    });
  }
  // console.log(wallet);
  return wallet.filter(item => item.hasOwnProperty('idCMC'));
}

export default addCoinMarketCapIds;