import axios from 'axios';


const getCoinGeckoData = () => {

    const coinGeckoTokens = JSON.parse(localStorage.getItem('coinGeckoTokens'));

    // alert('getCoinGeckoTokens ');

    if (coinGeckoTokens === null) {
        axios.get('https://api.coingecko.com/api/v3/coins/list?vs_currency=usd&order=market_cap_desc')
            .then(res => {
                localStorage.setItem('coinGeckoTokens', JSON.stringify(res.data));
                return res.data;
            }
            ).catch
            (err => {
                console.log(err);
            }
            )
    } else {
        console.log('coinGeckoTokens already loaded');
        return coinGeckoTokens;
    }
}
// https://api.coingecko.com/api/v3/simple/price?vs_currency=usd&ids=bitcoin
//https://api.coingecko.com/api/v3/coins/markets?ids=bitcoin&vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y

export default getCoinGeckoData;