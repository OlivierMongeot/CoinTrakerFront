

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));


/**
 * @param currency ex : eth
 * @param  date ex : 20-10-22
 * @returns 
 */
const getFiatValue = async (currency, date) => {

  console.log('get Fiat price for date for ', currency, date)

  let tokenGecko = JSON.parse(localStorage.getItem('GekocoinsData'))
  // console.log(tokenGecko)

  let idGeko = tokenGecko.filter((element => {
    return (element.symbol).toLowerCase() === currency.toLowerCase();
  }))

  // console.log('Filtred geko ', idGeko)
  let url = '';

  if (idGeko.length === 0) {

    url = "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=" + date;
    console.log('error : id CoinGecko non available')
    return { usd: 1, error: 'id CoinGecko non available' }
  } else {

    url = "https://api.coingecko.com/api/v3/coins/"
      + (idGeko[0].id).toLowerCase() + "/history?date=" + date;
  }

  const saveLastTimeQuotation = () => {
    localStorage.setItem('last_quote_time', JSON.stringify(Date.now()))
  }

  const getLastTimeQuotation = () => {

    return localStorage.getItem('last_quote_time')
  }


  const historyPrice = async (url) => {
    try {
      let time = getLastTimeQuotation();
      let delta = Date.now() - parseInt(time)
      if (delta < 9000) {
        // add time 
        let add = 9000 - delta
        console.log('await ' + add + 'ms')
        await delay(add);
      } else {
        console.log('no await')
      }

      saveLastTimeQuotation(Date.now())
      const response = await fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      const price = await response.json();
      // console.log('price', price);
      return price;
    } catch (error) {
      console.log('error', error);
    }
  }

  const prices = await historyPrice(url);

  console.log('Prices history return ', prices)

  if (prices && prices.market_data) {
    return prices.market_data.current_price
  }
  else {
    console.log('Error price historic, Keep origin value ')
    return null;
  }
}


export default getFiatValue;