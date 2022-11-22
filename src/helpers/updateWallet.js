
import axios from 'axios';
import getCMCIdMap from './getCoinMarketCapIdMap';
import addCoinMarketCapPrice from './getPricesCMCApi';
import setupBalanceStorage from './setupBalanceStorage';


const buildWallet = async (wallet, exchange) => {

    const cmcTokensList = await getCMCIdMap();

    const seturlLogo = (tokenCode, tokenId) => {
        if (tokenCode === 'ETH2') {
            return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
        } else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }

    }

    const particularSetup = (walletElement, token, exchange) => {
        switch (exchange) {
            case 'kucoin':
                if (token.symbol === 'POL') {
                    // console.log('Data COINMARKETCAP', token);
                    // console.log('Data From API', walletElement);
                    walletElement.urlLogo = seturlLogo(token.symbol, 6297);
                    walletElement.name = 'Proof of iquidity';
                }
                break;

            case 'gateio':
                if (token.symbol === 'POINT') {
                    walletElement.urlLogo = seturlLogo(token.symbol, 6297);
                    walletElement.name = 'Proof of iquidity';
                }
                break;
            default:
                break;
        }
        return walletElement;
    }

    const addCoinMarketCapID = (wallet) => {
        for (let i = 0; i < wallet.length; i++) {
            // cherche dans cmcTokensList le token avec le code wallet[i].code pour retrouver le prix live 
            cmcTokensList.filter(token => {

                switch (exchange) {
                    case 'kucoin':
                        if (token.symbol === wallet[i].currency) {

                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i] = particularSetup(wallet[i], token);
                        }
                        break;

                    case 'gateio':
                        if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                            wallet[i] = particularSetup(wallet[i], token);
                            wallet[i].balance = parseFloat(wallet[i].available) + parseFloat(wallet[i].locked);
                        }
                        break;

                    case 'coinbase':
                        if (token.symbol === wallet[i].code) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].balance = wallet[i].amount;
                        }
                        break;

                    case 'crypto-com':
                        if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                        }
                        break;

                    case 'binance':
                        if (token.symbol === wallet[i].currency) {

                            wallet[i].idCMC = token.id;
                            wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
                            wallet[i].name = token.name;
                            wallet[i].code = token.symbol;
                            wallet[i].timestamp = new Date().getTime();
                        }
                        break;

                    default:
                        break;
                }

                return token.symbol === wallet[i].currency;
            });
        }
        return wallet.filter(item => item.hasOwnProperty('idCMC'));
    }

    const totalBalance = (wallet, exchange) => {
        let totalBalance = 0;
        for (let i = 0; i < wallet.length; i++) {
            let value = parseFloat(wallet[i].balance) * wallet[i].live_price;
            totalBalance += value;
            wallet[i].dollarPrice = value;
        }
        // Save walletBalance in localStorage
        setupBalanceStorage(exchange, totalBalance);

        // return totalBalance;
    }

    wallet = await addCoinMarketCapID(wallet);

    wallet = await addCoinMarketCapPrice(wallet, exchange);

    console.log('Wallet after price update', wallet)

    totalBalance(wallet, exchange);
    return wallet;

}


const getWallet = async (ex) => {
    let url = "http://192.168.0.46:4000/" + ex + "/wallet";
    let response = await axios.get(url);
    return await buildWallet(response.data, ex);
}

export default getWallet;