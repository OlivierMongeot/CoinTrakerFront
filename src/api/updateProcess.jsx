import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shouldIUpdate from '../helpers/shouldIUpdate'
import addCoinMarketCapQuote from '../api/getPricesQuoteCMC';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';
import updateWalletAmountInLS from '../helpers/updateWalletAmountInLS';
import rotateSpinner from '../helpers/rotateSpinner';
import stopSpinner from '../helpers/stopSpinner';
import AuthenticationService from '../helpers/AuthService';

const totalExchange = (result) => {
  let arrayTotals = [];
  result.forEach(element => {
    arrayTotals.push(element.balance * element.live_price);
  });
  return arrayTotals.reduce((acc, val) => acc + val, 0);
}


export default async function updateProcess(exchange, arrayAmountWallets, updateAllWallets, force = false) {
  exchange = exchange.toLowerCase();
  console.log('Update process', exchange);

  const updateGeneralWalletLS = (newExchangeData, exchange) => {
    // console.log('updateGeneralWalletLS ');
    let currentGeneralWallet = JSON.parse(localStorage.getItem('wallet-all'));
    // console.log('currentGeneralWallet ', currentGeneralWallet);
    if (currentGeneralWallet === null) {
      localStorage.setItem('wallet-all', JSON.stringify(newExchangeData));
      return newExchangeData;
    }
    // Suprime les ancienne data de l'echange en cours d'update
    let newDatafilterd = currentGeneralWallet.filter((element) => element.exchange !== exchange);
    let finalRes = newDatafilterd.concat(newExchangeData);
    // console.log('update General Wallet finalRes', finalRes);
    localStorage.setItem('wallet-all', JSON.stringify(finalRes));
    return finalRes;
  }

  const addCustomToken = (exchange) => {
    // console.log('token custom to add ');
    const walletCustom = JSON.parse(localStorage.getItem('wallet-custom'));
    if (walletCustom === null) {
      return [];
    }
    // recupere les token de l'exchange
    const filtred = walletCustom.filter((tokenData) => {
      return tokenData.exchange === exchange;
    })
    return filtred;
  }

  const completeDataWallet = async (wallet, exchange) => {
    // console.log('before complete Data Wallet :  ', wallet)
    addCustomToken(exchange).map((element) => {
      return wallet.push(element);
    });
    // console.log('Wallet with custom coin', wallet);

    if (wallet.length > 0) {
      wallet = await addCoinMarketCapIds(wallet, exchange);
      return await addCoinMarketCapQuote(wallet, exchange);
    } else {
      return false;
    }
  }


  const getAPIData = async (url, jws) => {
    console.log('fetch');
    try {
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'authorization': jws
        }
      })
      if (!result) {
        console.log(result);
        console.log(result.status);
        toast('Token is expired : please login');
        throw new Error('no data : check token pls ' + result.data);
      }
      return result.json();
    } catch (error) {
      console.log('catch error');
      toast('http error : check your connection');
      throw new Error("HTTP error " + error.message);
    }
  }

  let shoudIUpdate = null;
  force === false ? shoudIUpdate = shouldIUpdate(exchange) : shoudIUpdate = true;

  switch (shoudIUpdate) {

    case true:
      rotateSpinner(exchange, arrayAmountWallets);
      // let rowResult = await apiCall(exchange);
      console.log('API CALL');
      let user = JSON.parse(localStorage.getItem('user'));
      let jws = null;
      if (user && user.token) {
        jws = user.token;
      } else {
        console.log('no user in ls');
        return 'no-user';
      }

      // TODO if no user 
      let result = await getAPIData("http://192.168.0.46:4000/" + exchange + "/wallet", jws);
      let data = null;

      if (result.data && result.data.name === 'TokenExpiredError') {
        console.log('message ', result.data.name)

        stopSpinner(exchange, arrayAmountWallets);
        AuthenticationService.isAuthenticated = false;
        return 'TokenExpiredError';

      } else if (result) {
        data = await completeDataWallet(result, exchange)
      } else {
        toast("No connection");
      }

      if (data !== null) {

        const total = totalExchange(data);
        updateWalletAmountInLS(arrayAmountWallets, exchange, total);
        localStorage.setItem('wallet-' + exchange, JSON.stringify(data));

        stopSpinner(exchange, arrayAmountWallets);
        switch (updateAllWallets) {
          case false:
            updateGeneralWalletLS(data, exchange);
            return data;

          default:
            return updateGeneralWalletLS(data, exchange);
        }
      }
      break;

    // No update : take info from LocalStorage
    case false:
      if (updateAllWallets) {
        return JSON.parse(localStorage.getItem('wallet-all'));
      } else {
        return JSON.parse(localStorage.getItem('wallet-' + exchange));
      }

    default:
      break;

  }
}



