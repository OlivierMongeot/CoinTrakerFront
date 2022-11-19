import axios from 'axios';

const getPricesCMCApi = async (currencies, wallet, exchange) => {

    // Check if currencies are in cmcTokensList and get  the CoinGeck ID for each currency
    // get prices for all currencies
    let url = '/cmc/prices?symbol=' + currencies;
    const response = await axios.get(url);
    // Parse response.data to simplify the data
    let prices = response.data;
    let pricesMap = {};
    for (let i = 0; i < prices.length; i++) {
        pricesMap[prices[i][0].symbol] = prices[i][0].quote.USD.price;
    }

    // Add price to wallet
    for (let i = 0; i < wallet.length; i++) {
        let codeWallet = wallet[i].code;
        let live_price = pricesMap[codeWallet];
        if (exchange === 'gateio' && codeWallet === 'POINT') {
            wallet[i].live_price = 0;
            wallet[i].name = 'GatePoint';
        } else {
            wallet[i].live_price = parseFloat(live_price);
        }

    }
    return wallet;
}

export default getPricesCMCApi;