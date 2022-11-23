import axios from 'axios';

const getPricesCMCApi = async (wallet, exchange) => {


    let currencies = '';
    for (let i = 0; i < wallet.length; i++) {
        let currency = wallet[i].currency;
        if (currency === 'ETH2') {
            currency = 'ETH'
            currencies += currency + ',';
        } else if (currency === 'POL') {
            // supprime 
        } else {
            currencies += currency + ',';
        }


    }
    currencies = currencies.slice(0, -1);

    // console.log('List Token to search CMC API :', currencies);

    let url = 'http://192.168.0.46:4000/cmc/prices?symbol=' + currencies;

    const response = await axios.get(url);
    // Parse response.data to simplify the data
    let prices = response.data;
    // console.log('Prices CMC API ', prices);
    let pricesMap = {};
    let quoteMap = {};
    for (let i = 0; i < prices.length; i++) {
        pricesMap[prices[i][0].symbol] = prices[i][0].quote.USD.price;
        quoteMap[prices[i][0].symbol] = prices[i][0].quote;
    }

    // Add price to wallet
    for (let i = 0; i < wallet.length; i++) {
        let codeWallet = wallet[i].code;
        let live_price = pricesMap[codeWallet];
        let quote = quoteMap[codeWallet];
        if (exchange === 'gateio' && codeWallet === 'POINT') {
            wallet[i].live_price = 0;
            wallet[i].name = 'GatePoint';
        } else if (wallet[i].code === 'ETH2') {
            if (exchange !== 'kucoin') {

                live_price = pricesMap['ETH'];
                wallet[i].live_price = parseFloat(live_price);
                wallet[i].quoteCMC = quoteMap['ETH'];
            } else {
                console.log('getPricesCMCApi ETH2', wallet[i].code);
                live_price = pricesMap['ETH'];
                wallet[i].live_price = wallet[i].quoteAPIorigin.averagePrice * parseFloat(live_price)
                wallet[i].quoteCMC = quoteMap['ETH'];
            }


        } else if (wallet[i].code === 'POL') {
            wallet[i].live_price = wallet[i].quoteAPIorigin.averagePrice;
            wallet[i].quoteCMC = null;
        }

        else {
            wallet[i].live_price = parseFloat(live_price);
            wallet[i].quoteCMC = quote;
        }


    }
    return wallet;
}

export default getPricesCMCApi;