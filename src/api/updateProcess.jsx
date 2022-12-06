import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shouldIUpdate from '../helpers/shouldIUpdate'
import addCoinMarketCapQuote from '../api/getPricesQuoteCMC';
import setupBalanceStorage from '../helpers/setupBalanceStorage';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';
import updateWalletAmountInLS from '../helpers/updateWalletAmountInLS';
import setAndSaveTotalAllWallets from '../helpers/setAndSaveTotalAllWallets';
import rotateSpinner from '../helpers/rotateSpinner';
import stopSpinner from '../helpers/stopSpinner';
import AuthenticationService from '../helpers/AuthService';

const totalExchange = (result) => {
  // Calcul le total pour les props
  let arrayTotalExchange = [];
  result.forEach(element => {
    arrayTotalExchange.push(element.balance * element.live_price);
  });

  let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
  // console.log('Updated total exchange', total);
  return total;
}

export default async function updateProcess(exchange, parentData, props, updateAllWallets, force = false) {

  console.log('Update process', exchange);

  const updateGeneralWallet = (newExchangeData, exchange) => {
    // console.log('updateGeneralWallet ');
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

  const setTotalBalanceWallet = (wallet, exchange) => {
    let totalBalance = 0;
    for (let i = 0; i < wallet.length; i++) {
      let value = parseFloat(wallet[i].balance) * wallet[i].live_price;
      totalBalance += value;
      wallet[i].dollarPrice = value;
    }
    setupBalanceStorage(exchange, totalBalance);
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
    // console.log('filtred token add', filtred);
    return filtred;
  }

  const completeDataWallet = async (wallet, exchange) => {
    // console.log('before complete Data Wallet :  ', wallet)
    addCustomToken(exchange).map((element) => {
      // console.log("push", element);
      return wallet.push(element);
    });
    // console.log('Wallet with custom coin', wallet);

    if (wallet.length > 0) {
      wallet = await addCoinMarketCapIds(wallet, exchange);
      // console.log('after completed Data Wallet :  ', wallet)
      wallet = await addCoinMarketCapQuote(wallet, exchange);
      setTotalBalanceWallet(wallet, exchange);

      return wallet;
    } else {
      return false;
    }
  }


  const getFetch = async (url, jws) => {
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
      rotateSpinner(exchange, parentData);
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

      let result = await getFetch("http://192.168.0.46:4000/" + exchange + "/wallet", jws);
      let data = null;

      if (result.data && result.data.name === 'TokenExpiredError') {
        console.log('message ', result.data.name)
        toast("Token expired ! Please log in ");
        stopSpinner(exchange, parentData);
        AuthenticationService.isAuthenticated = false;
        return 'TokenExpiredError';

      } else if (result) {
        data = await completeDataWallet(result, exchange)
      } else {
        toast("No connection");
      }

      // console.log('data ', data)

      if (data !== null) {
        let total = totalExchange(data);
        // console.log('props', props);
        props.setTotalExchange(total);
        // Set Total In Local Storage 
        localStorage.setItem('total-' + exchange, JSON.stringify(total));

        updateWalletAmountInLS(parentData, exchange, total);

        setAndSaveTotalAllWallets(parentData, props);

        localStorage.setItem('wallet-' + exchange, JSON.stringify(data));

        stopSpinner(exchange, parentData);
        switch (updateAllWallets) {
          case false:
            updateGeneralWallet(data, exchange);
            // console.log('set Wallet ', data);
            // setWallets(data);
            return data;
          // props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));
          // break;

          default:
            // console.log('display all wallet');
            let allWallet = updateGeneralWallet(data, exchange);
            // setWallets(allWallet);
            return allWallet;
          // break;
        }

      }

      break;

    // No update : take info from LocalStorage
    case false:

      if (updateAllWallets) {

        props.setTotalExchange(JSON.parse(localStorage.getItem('total-' + exchange)));
        return JSON.parse(localStorage.getItem('wallet-all'));

      } else {

        props.setTotalExchange(JSON.parse(localStorage.getItem('total-' + exchange)));
        return JSON.parse(localStorage.getItem('wallet-' + exchange));
      }

    default:
      // Nothing
      break;

  }
}



