import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shouldIUpdate from '../helpers/shouldIUpdate'
import addCoinMarketCapQuote from '../api/getPricesQuoteCMC';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';
import updateWalletAmountInLS from '../helpers/updateWalletAmountInLS';
import rotateSpinner from '../helpers/rotateSpinner';
import stopSpinner from '../helpers/stopSpinner';
import AuthenticationService from '../helpers/AuthService';
// import axios from 'axios';
import config from '../config';


const totalExchange = (result) => {
  let arrayTotals = [];
  result.forEach(element => {
    const value = element.balance * element.live_price;

    // console.log('totalExchange value ' + element.currency, value)
    arrayTotals.push(value);
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

  const completeDataWallet = async (wallet, exchange, ip) => {
    // console.log('before complete Data Wallet :  ', wallet)
    addCustomToken(exchange).map((element) => {
      return wallet.push(element);
    });


    if (wallet.length > 0) {
      wallet = await addCoinMarketCapIds(wallet, exchange, ip);
      // console.log('Wallet with addCoinMarketCapIds', wallet);
      wallet = await addCoinMarketCapQuote(wallet, exchange, ip);
      // console.log('Wallet with addCoinMarketCapQuote', wallet);
      return wallet
    } else {
      console.log('wallet.length < 0')
      return false;
    }
  }

  const getAPIData = async (url, user, exchange) => {

    console.log('getAPIData for ', user.email);

    const data = JSON.stringify({
      email: user.email,
      exchange: exchange
    });

    console.log('user to fetch ', data);
    // console.log('usertoken ', user.token);
    try {
      console.log('try fetch')
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        body: data
      })

      console.log('result response ', response)
      const result = await response.json();

      if (!result) {
        console.log(result);
        // toast('Token is expired : please login');
        throw new Error('no data : check token pls ');
      }
      console.log('result row', result);

      return result;

    } catch (error) {
      console.log('catch error', error);
      throw new Error("HTTP error " + error.message);
    }
  }

  let shoudIUpdate = null;
  force === false ? shoudIUpdate = shouldIUpdate(exchange) : shoudIUpdate = true;

  switch (shoudIUpdate) {


    case true:
      rotateSpinner(exchange, arrayAmountWallets);

      console.log('API CALL');
      const user = JSON.parse(localStorage.getItem('user'));

      if (user && user.token) {
        // jws = user.token;'
        const ip = config.urlServer;
        const url = "http://" + ip + "/" + exchange + "/wallet";
        // let url = "http://192.168.0.46:4000/" + exchange + "/wallet";
        let result = await getAPIData(url, user, exchange);
        let data = null;
        console.log('result getAPIData ', result)

        if (result.data && result.data.name === 'TokenExpiredError') {
          console.log('message ', result.data.name)
          stopSpinner(exchange, arrayAmountWallets);
          AuthenticationService.isAuthenticated = false;
          return [];

        } else if (result[0].id === 'authentication_error') {
          stopSpinner(exchange, arrayAmountWallets);
          console.log('authentication_error ' + result[0].message);
          return [];

        }


        else if (result) {

          if (result.message
            && result.message.label) {
            console.log('Error : ', result.message.label)
            toast("API keys not good for " + exchange)
            throw new Error('INVALID_SIGNATURE for ' + exchange);
          }

          // console.log('result  await getAPIData', result)
          data = await completeDataWallet(result, exchange, ip)
          // console.log('await completeDataWallet', data);
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
              // return the result : all wallet 
              return updateGeneralWalletLS(data, exchange);
          }
        } else {
          console.log('No data in wallet ')
          throw new Error('no data : ', data);
        }


      } else {
        console.log('no user in ls');
        throw new Error('no user : ', user);
      }

    // break;

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



