import axios from 'axios';


const getCoinGeckoMarket = () => {

  const coinGeckoMarket = JSON.parse(localStorage.getItem('coinGeckoMarket'));


  if (coinGeckoMarket === null) {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y')
      .then(res => {
        localStorage.setItem('coinGeckoMarket', JSON.stringify(res.data));
        return res.data;
      }
      ).catch
      (err => {
        console.log(err);
      }
      )
  } else {
    console.log('coinGeckoTokens from Local Storage');
    return coinGeckoMarket;
  }
}

export default getCoinGeckoMarket;