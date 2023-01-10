import axios from 'axios';

const getListCurrencies = (wallet) => {
    let currencies = '';
    for (let i = 0; i < wallet.length; i++) {

        // wallet[i].balance = parseFloat(wallet[i].amount);

        let currency = wallet[i].currency;
        // console.log(currency);
        if (currency === 'ETH2') {
            currency = 'ETH'
            currencies += currency + ',';
        } else if (currency === 'POL') {
            // supprime 
        } else {
            currencies += currency + ',';
        }
    }
    return currencies.slice(0, -1);
}


const getPricesQuotesCMC = async (wallet, exchange, ip) => {
    // console.log('getPricesQuotesCMC')

    const url = 'http://' + ip + '/cmc/prices?symbol=' + getListCurrencies(wallet);
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
        let currencyWallet = wallet[i].currency;
        let live_price = pricesMap[currencyWallet];
        let quote = quoteMap[currencyWallet];
        // Check special coin 
        if (exchange === 'gateio' && currencyWallet === 'POINT') {
            wallet[i].live_price = 0;
            wallet[i].name = 'GatePoint';
        } else if (wallet[i].currency === 'ETH2') {
            if (exchange !== 'kucoin') {

                live_price = pricesMap['ETH'];
                wallet[i].live_price = parseFloat(live_price);
                wallet[i].quoteCMC = quoteMap['ETH'];
            } else {
                // Because Kucoin ETH2 is a different token that ETH2 Coinbase 
                console.log('getPricesCMCApi ETH2', wallet[i].currency);
                live_price = pricesMap['ETH'];
                wallet[i].live_price = wallet[i].quoteAPIorigin.averagePrice * parseFloat(live_price)
                wallet[i].quoteCMC = quoteMap['ETH'];
            }


        } else if (wallet[i].currency === 'POL') {
            wallet[i].live_price = wallet[i].quoteAPIorigin.averagePrice;
            wallet[i].quoteCMC = null;
        }

        else {

            wallet[i].live_price = parseFloat(live_price);
            wallet[i].quoteCMC = quote;
        }
        delete wallet[i].code;
        delete wallet[i].id;
        delete wallet[i].available;


    }
    return wallet;
}

export default getPricesQuotesCMC;