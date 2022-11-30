import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import updateWallet from '../api/updateWallet';
import formatValues from '../helpers/formatValues';
// import { width } from '@mui/system';
// import AuthenticationService from '../helpers/AuthService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import addCoinMarketCapQuote from '../api/getPricesQuoteCMC';
import setupBalanceStorage from '../helpers/setupBalanceStorage';
// import formatValues from '../helpers/formatValues';
import minValueDollarToDisplayToken from '../helpers/minValueDollarToDisplayToken';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';

export default function Ledger(props) {

  const [wallets, setWallets] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);

  let parentData = props.arrayAmountWallets;
  const exchagesEnable = props.exchanges;


  const totalWallet = (result) => {
    // Calcul le total pour les props
    let arrayTotalExchange = [];
    result.forEach(element => {
      arrayTotalExchange.push(element.balance * element.live_price);
    });

    let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
    // console.log('Updated total exchange', total);
    return total;

  }


  const updateProcess = async (exchange, parentData, props) => {

    const timer = 360000;

    const rotateSpinner = (exchangeName, parentData) => {
      if (parentData && parentData.find(e => e.exchange === exchangeName)) {
        // if (parentData) {
        const idElement = '#wallet-spinner-' + exchangeName;
        const spinnerElement = document.querySelector(idElement);
        // spinnerElement.classList.add('show');
        if (spinnerElement) {
          spinnerElement.classList.remove('hide');
        }
      }
    }

    const stopSpinner = (exchangeName, parentData) => {
      if (parentData && parentData.find(e => e.exchange === exchangeName)) {
        const idElement = '#wallet-spinner-' + exchangeName;
        const spinnerElement = document.querySelector(idElement);
        // spinnerElement.classList.remove('show');
        // console.log(spinnerElement);
        if (spinnerElement) {
          spinnerElement.classList.add('hide');
        }
      }
    }

    const completeDataWallet = async (wallet, exchange) => {

      const totalBalanceWallet = (wallet, exchange) => {
        let totalBalance = 0;
        for (let i = 0; i < wallet.length; i++) {
          let value = parseFloat(wallet[i].balance) * wallet[i].live_price;
          totalBalance += value;
          wallet[i].dollarPrice = value;
        }
        setupBalanceStorage(exchange, totalBalance);
      }


      if (wallet.length > 0) {
        wallet = await addCoinMarketCapIds(wallet, exchange);
        wallet = await addCoinMarketCapQuote(wallet, exchange);
        console.log('Wallet after price update', wallet)
        totalBalanceWallet(wallet, exchange);
        return wallet;
      } else {
        return false;
      }


    }


    const updateWalletsAmount = (parentData, exchange, total, props) => {
      // console.log('updateWalletsAmount with this data : ', parentData, exchange, total)

      let exchangeInArray = false;
      for (let i = 0; i < parentData.length; i++) {
        if (parentData[i].exchange === exchange) {
          parentData[i].amount = total;
          exchangeInArray = true;
        }
      }
      if (exchangeInArray === false) {
        parentData.push({ exchange: exchange, amount: total });
      }
      // if (exchange !== 'all') {
      localStorage.setItem('wallets-amount', JSON.stringify(parentData));
      // }

    }

    const setAndSaveTotalAllExchanges = (parentData, props) => {
      let acc = 0;
      for (let i = 0; i < parentData.length; i++) {
        let value = parentData[i].amount;
        if (parentData[i].exchange !== 'all') {
          acc += value;
        }
      }
      // console.log('setTotalAllWallet', acc)
      localStorage.setItem('wallets-total', JSON.stringify(acc));
      props.setTotalAllWallet(acc);
    }



    const shouldIUpdateDataFromAPI = (exchangeName) => {

      if ('wallet-' + exchangeName in localStorage && (typeof (localStorage.getItem('wallet-' + exchangeName)) === 'string')) {

        let walletLocalStorage = JSON.parse(localStorage.getItem('wallet-' + exchangeName));
        if (!walletLocalStorage) {
          console.log('Wallet vide Trouvé en local Store');
          return false;
        }
        console.log('Wallet  ' + exchangeName + ' in LocalStorage for');

        if (walletLocalStorage.length > 0) {

          let difference = new Date().getTime() - walletLocalStorage[0].timestamp // timestamp
          if (difference > timer) {

            console.log('Time > 6 min , Update Wallet from API');
            return true;
          } else {
            console.log('Recent Time update, Display Wallet ' + exchangeName + ' from Local Store');
            return false;
          }
        } else {
          console.log('Data: wallet-' + exchangeName + ' est un tableau vide');
          return true;
        }
      } else {
        console.log('Data: wallet-' + exchangeName + ' n\'existe pas');
        return true;
      }


    }

    // console.log('updateProcess', exchange)
    let shoudIUpdate = shouldIUpdateDataFromAPI(exchange);
    if (shoudIUpdate) {
      rotateSpinner(exchange, parentData);
      // let rowResult = await apiCall(exchange);
      console.log('APICALL');
      let url = "http://192.168.0.46:4000/" + exchange + "/wallet";
      let user = JSON.parse(localStorage.getItem('user'));
      let jws = user.token;
      console.log('token used for connection', jws);

      fetch(url, {
        method: 'GET', // or 'PUT'
        headers: {
          'authorization': jws
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          // if (data.data.message && data.data.message === 'jwt expired') {
          //     console.log('token expired');
          //     return 'jwt expired';
          // }
          let completeData = completeDataWallet(data, exchange);

          completeData.then((data) => {
            console.log('completeData after', data);
            let result = data;
            if (result) {
              let total = totalWallet(result);
              // console.log('props', props);
              props.setTotalExchange(total);
              // Set Total In Local Storage 
              localStorage.setItem('total-' + exchange, JSON.stringify(total));

              updateWalletsAmount(parentData, exchange, total, props);

              setAndSaveTotalAllExchanges(parentData, props);

              localStorage.setItem('wallet-' + exchange, JSON.stringify(result));
              stopSpinner(exchange, parentData);

              // return result;
              setWallets(result);
              // used for display last time update on main page
              props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));

            } else {
              stopSpinner(exchange, parentData);
              alert('this gestion is todo : Ledger ligne 217');
              return false;
            }

            // return data;
          })


          // return data;
        })
        .catch((error) => {
          console.error('Error:', error);
          return error;
        });



    } else {
      // console.log("data from LOCAL STORE");
      setWallets(JSON.parse(localStorage.getItem('wallet-' + exchange)));
    }
  }


  const getCompletedWallet = async (exchange, exchanges) => {

    updateProcess(exchange, parentData, props);
    // let result = await updateWallet(exchange, exchanges, parentData, props, setWallets);
    // if (result) {
    //   // setWallets(result);
    //   // // used for display last time update on main page
    //   // props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));
    // } else {

    //   toast("Wow so easy!");
    // }
  }


  React.useEffect(() => {

    console.log('_____________________________')
    console.log('Wallet useEffect exchange : ', 'wallet-' + exchangeName);

    getCompletedWallet(exchangeName, exchagesEnable);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);

  return (
    <React.Fragment>
      <ToastContainer />
      <Table className="table-wallet" size="small" >
        <TableHead>
          <TableRow align="right" >
            <TableCell >Token</TableCell>
            <TableCell align="right" >Balance</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">1h %</TableCell>
            <TableCell align="right">24h %</TableCell>
            <TableCell align="right">7j % </TableCell>
            <TableCell align="right">Total </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={exchangeName + ' table-wallet'}>
          {wallets && wallets
            .filter(token => token.balance > 0)
            .filter(token => (token.balance * token.live_price) > minValueDollarToDisplayToken(exchangeName))
            .sort(function (a, b) {
              return b.balance * b.live_price - a.balance * a.live_price;
            })
            .map((wallet, key) => (
              <TableRow key={key}>
                <TableCell
                  style={{
                    display: 'flex'
                  }}
                  className="table-row" >
                  <div style={{
                    margin: '0'
                  }}
                    className='token-display'>
                    <div className="image-token">
                      <img src={
                        wallet.urlLogo ? wallet.urlLogo :
                          'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
                      } alt={wallet.name} />
                    </div>

                    <div style={{
                      fontSize: 'small'
                    }}
                      className="name-token">
                      {wallet.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="right" className="table-row">{formatValues('price', wallet.balance)} {wallet.code}</TableCell>
                <TableCell align="right" className="table-row">
                  {formatValues('price', wallet.live_price)} $
                </TableCell>

                <TableCell
                  style={{

                    textAlign: 'right',
                    color: `${formatValues('switch-color', wallet.quoteCMC ?
                      (wallet.quoteCMC.USD.percent_change_1h) :
                      (wallet.quoteAPIorigin ? (wallet.quoteAPIorigin.changeRate) : ''))}`
                  }}
                  className="table-row change">
                  {(wallet.quoteCMC) ?
                    (formatValues('pourcent', wallet.quoteCMC.USD.percent_change_1h)) :
                    (wallet.quoteAPIorigin ? formatValues('pourcent', wallet.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>


                <TableCell
                  style={{

                    textAlign: 'right',
                    color: `${formatValues('switch-color', wallet.quoteCMC ?
                      (wallet.quoteCMC.USD.percent_change_24h) :
                      (wallet.quoteAPIorigin ? (wallet.quoteAPIorigin.changeRate) : '...'))}`
                  }}
                  className="table-row change">
                  {(wallet.quoteCMC) ?
                    (formatValues('pourcent', wallet.quoteCMC.USD.percent_change_24h)) :
                    (wallet.quoteAPIorigin ? formatValues('pourcent', wallet.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>
                <TableCell
                  style={{
                    width: "5%",
                    textAlign: 'right',
                    color: `${formatValues('switch-color', wallet.quoteCMC ?
                      (wallet.quoteCMC.USD.percent_change_7d) :
                      (wallet.quoteAPIorigin ? (wallet.quoteAPIorigin.changeRate) : '...'))}`
                  }}
                  className="table-row change">
                  {(wallet.quoteCMC) ?
                    (formatValues('pourcent', wallet.quoteCMC.USD.percent_change_7d)) :
                    (wallet.quoteAPIorigin ? formatValues('pourcent', wallet.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>

                <TableCell className="table-row" align="right">{formatValues('price', (wallet.live_price * wallet.balance))} $</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </React.Fragment >
  );
}
