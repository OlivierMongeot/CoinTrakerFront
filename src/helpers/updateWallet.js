// import { breakpoints } from '@mui/system';
import axios from 'axios';
// import buildWallet from '../helpers/buildWallet';
import getCMCIdMap from './getCoinMarketCapIdMap';
import getPricesCMCApi from './getPricesCMCApi';
import setupBalanceStorage from './setupBalanceStorage';
import getCoinGeckoMarket from './getCoinGeckoMarket';

const buildWallet = async (wallet, exchange) => {
    console.log('buildWallet ' + exchange);

    let cmcTokensList = await getCMCIdMap();
    // add ETH2 in cmcTokensList because it's not available
    cmcTokensList.push({
        "id": 0,
        "name": "Ethereum 2",
        "symbol": "ETH2",
        "slug": "eth2"
    });

    const seturlLogo = (tokenCode, tokenId) => {
        if (tokenCode === 'ETH2') {
            return "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
        } else { return "https://s2.coinmarketcap.com/static/img/coins/64x64/" + tokenId + ".png"; }

    }

    const setMarketData = (wallet) => {

        geckoMarket.filter(marketToken => {
            if ((wallet.currency).toUpperCase() === (marketToken.symbol).toUpperCase()) {
                // console.log('filter gecko for variation ', wallet.currency)
                // console.log('marketToken 24h% ', marketToken.price_change_percentage_24h)
                wallet.variation24h = marketToken.price_change_percentage_24h;
                wallet.variation1h = marketToken.price_change_percentage_1h_in_currency;
                wallet.variation7day = marketToken.price_change_percentage_7d_in_currency;
            }
            return marketToken.symbol === wallet.currency;
        })
    }

    const geckoMarket = getCoinGeckoMarket();

    // console.log('CoinGeckoMarket', geckoMarket);

    console.log('wallet to build ' + exchange);

    for (let i = 0; i < wallet.length; i++) {

        // cherche dans cmcTokensList le token avec le code wallet[i].code pour retrouver le prix live 

        cmcTokensList.filter(token => {

            switch (exchange) {
                case 'kucoin':
                    if (token.symbol === wallet[i].currency) {


                        wallet[i].idCMC = token.id;
                        wallet[i].urlLogo = seturlLogo(token.symbol, token.id);
                        wallet[i].name = token.name;
                        wallet[i].id_wallet = wallet[i].idCMC + wallet[i].type;
                        wallet[i].code = token.symbol;
                        wallet[i].timestamp = new Date().getTime();
                        if (token.symbol === 'POL') {
                            console.log('Data COINMARKETCAP', token);
                            console.log('Data From API', wallet[i]);
                            wallet[i].urlLogo = seturlLogo(token.symbol, 6297);
                            wallet[i].name = 'Proof of iquidity';
                        }
                        // Add the % variation market 
                        setMarketData(wallet[i]);
                    }


                    break;

                case 'gateio':
                    if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                        wallet[i].idCMC = token.id;

                        wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                        wallet[i].name = token.name;
                        wallet[i].id_wallet = wallet[i].idCMC;
                        wallet[i].code = token.symbol;
                        wallet[i].timestamp = new Date().getTime();
                        wallet[i].id = wallet[i].idCMC;
                        if (token.symbol === 'POINT') {

                            wallet[i].urlLogo = seturlLogo(token.symbol, 6297);
                            wallet[i].name = 'Proof of iquidity';
                        }
                        // console.log(token.name + ' locked ', parseFloat(wallet[i].locked));
                        // console.log(token.name + ' balance ', parseFloat(wallet[i].available));
                        wallet[i].balance = parseFloat(wallet[i].available) + parseFloat(wallet[i].locked);
                        setMarketData(wallet[i]);
                        // let variationsMarket = getVariations(wallet[i]);
                    }
                    break;

                case 'coinbase':
                    if (token.symbol === wallet[i].code) {
                        // check if params exist token.id
                        wallet[i].idCMC = token.id;
                        wallet[i].balance = wallet[i].amount;
                        wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                        setMarketData(wallet[i]);
                    }
                    break;

                case 'crypto-com':
                    if ((token.symbol).toLowerCase() === (wallet[i].currency).toLowerCase()) {
                        wallet[i].idCMC = token.id;

                        wallet[i].urlLogo = seturlLogo(wallet[i].code, token.id);
                        wallet[i].name = token.name;
                        wallet[i].id_wallet = wallet[i].idCMC;
                        wallet[i].code = token.symbol;
                        wallet[i].timestamp = new Date().getTime();
                        wallet[i].id = wallet[i].idCMC;
                        setMarketData(wallet[i]);
                    }
                    break;

                default:
                    break;
            }


            return token.symbol === wallet[i].code;
        });
    }

    console.log('wallet after amount update', wallet)

    let FWallet = wallet.filter(item => item.hasOwnProperty('idCMC'));

    // get prices for Gate io an crypto.com
    if (exchange === 'gateio' || exchange === 'crypto-com') {
        // Make a string of all the currencies in the wallet
        let currencies = '';
        for (let i = 0; i < FWallet.length; i++) {
            // Check if value currency is not in array unkownTokens
            currencies += FWallet[i].currency + ',';
        }
        currencies = currencies.slice(0, -1);
        // console.log('Currencies', currencies);

        FWallet = await getPricesCMCApi(currencies, FWallet, exchange);
        // console.log('walletPriced ', FWallet);
        // return walletPriced;
    }

    // calculate total balance
    let totalBalance = 0;
    for (let i = 0; i < FWallet.length; i++) {
        let value = parseFloat(FWallet[i].balance) * FWallet[i].live_price;
        totalBalance += value;
        FWallet[i].dollarPrice = value;
    }

    // Save walletBalance in localStorage
    setupBalanceStorage(exchange, totalBalance);
    // ici changer le state du total wallet 
    // console.log('Wallet Builded = ', FWallet);
    return FWallet;

}



const updateWallet = async (exchange) => {

    console.log('getWallet ' + exchange);

    let promess = await axios.get(exchange + '/wallet');

    if (exchange === 'kucoin') {
        return await buildWallet(promess.data.filtred, exchange);
    }

    if (exchange === 'coinbase') {
        return await buildWallet(promess.data.data, exchange);
    }

    if (exchange === 'gateio') {
        return await buildWallet(promess.data, exchange);
    }

    if (exchange === 'crypto-com') {
        return await buildWallet(promess.data, exchange);
    }



}

export default updateWallet;