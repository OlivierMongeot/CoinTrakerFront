import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import updateWallet from '../helpers/updateWallet';
import formatValues from '../helpers/formatValues';
import Loader from '../Dashboard/Loader';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Ledger(props) {

  const [wallets, setWallets] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);

  let parentData = props.arrayAmountWallets;
  console.log('parentdata Ledger', parentData);

  const updateWalletsAmount = (parentData, exchange, total) => {
    // if (parentData.length > 0) {
    // Check if data in locatStorage
    console.log('parentData', parentData);
    // let localStorageWalletsAmmount = JSON.parse(localStorage.getItem('wallets-amount'));
    // if (localStorageWalletsAmmount) {
    //   parentData = localStorageWalletsAmmount;
    // }
    // Recupere les infos en locaStorage
    // let totalAllWallets = JSON.parse(localStorage.getItem('wallets-amount'));
    // props.setArrayAmountWallets(totalAllWallets);

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
    // } 
    // else {
    //   parentData.push({ exchange: exchange, amount: total });
    // }

    localStorage.setItem('wallets-amount', JSON.stringify(parentData));
    props.setArrayAmountWallets(parentData);
  }

  const calculTotalGeneral = (parentData) => {
    let acc = 0;
    for (let i = 0; i < parentData.length; i++) {
      let value = parentData[i].amount;
      acc += value;
    }
    console.log('setTotalAllWallet', acc)
    localStorage.setItem('wallets-total', JSON.stringify(acc));
    props.setTotalAllWallet(acc);
  }

  const rotationLoader = (exchangeName) => {
    console.log(exchangeName);
    const idElement = '#wallet-spinner';
    const spinnerElement = document.querySelector(idElement);
    spinnerElement.classList.add('display');
  }

  const stopLoader = (exchangeName) => {
    const idElement = '#wallet-spinner';
    const spinnerElement = document.querySelector(idElement);
    spinnerElement.classList.remove('hidde');
    console.log('rotation loader off')
  }

  const getWallet = async (exchange, fromApi = true) => {
    console.log("getWallet from api : ", fromApi);
    let result = null;
    switch (fromApi) {
      case true:
        // start loader 
        rotationLoader(exchange);
        result = await updateWallet(exchange);
        stopLoader(exchangeName);
        // Stop Loader
        // Save in Local Storage
        localStorage.setItem('wallet-' + exchange, JSON.stringify(result));
        break;
      default:
        result = JSON.parse(localStorage.getItem('wallet-' + exchange));
        break;
    }
    console.log('setWallet', result);
    setWallets(result);

    // {formatValues('timestamp', result[0].timestamp)}
    props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));

    // Calcul le total 
    let arrayTotalExchange = [];
    result.forEach(element => {
      arrayTotalExchange.push(element.dollarPrice);
    });

    let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
    console.log('Updated total exchange', total);

    props.setTotalExchange(total);
    // Set Total In Local Storage 
    localStorage.setItem('total-' + exchange, JSON.stringify(total));

    updateWalletsAmount(parentData, exchange, total);

    calculTotalGeneral(parentData);
  }


  const getColorValue = (value) => {
    value = parseFloat(value)
    if (value >= 0) {
      return 'green';
    }
    else {
      return 'red';
    }
  }


  // console.log('Calcul des totaux');
  // Recupere les infos en locaStorage
  // let totalAllWallets = JSON.parse(localStorage.getItem('wallets-amount'));
  // console.log(totalAllWallets);
  // props.setArrayAmountWallets(totalAllWallets);

  React.useEffect(() => {
    // Check if user is authenticated todo
    // if(!AuthenticationService.isAuthenticated){
    //     console.log(AuthenticationService.isAuthenticated);
    //     window.location.href = '/login';
    // }
    console.log('_____________________________')
    console.log('Wallet useEffect exchange : ', exchangeName);

    //check if get available list of tokens from LocalStorage
    let walletLocalStorage = JSON.parse(localStorage.getItem('wallet-' + exchangeName));

    const isEmpty = Object.keys(walletLocalStorage != null ? walletLocalStorage : {}).length === 0;
    // console.log('Wallet is empty', isEmpty);

    if (walletLocalStorage === null || isEmpty) {
      console.log('No wallet in storage for ' + exchangeName);
      getWallet(exchangeName, true);

    } else {
      console.log('Wallet in LocalStorage for ' + exchangeName + ', check timestamp creation');
      // check if last update > 1 hour
      let dateLastUpdate = walletLocalStorage[0].timestamp // timestamp
      let dateNow = new Date().getTime();
      let difference = dateNow - dateLastUpdate;
      if (difference > 360000) {
        console.log('Time > 6 min , update Wallet after display old value');
        getWallet(exchangeName, true,);
      } else {
        console.log('Time < 6 min hour, Display Wallet from Local Store : ' + exchangeName);
        // getWallet(exchangeName, false);
        getWallet(exchangeName, false);
      }
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);



  return (

    <React.Fragment>

      <Table className="table-wallet"
        size="small"   >
        <TableHead>
          <TableRow align="right" >
            <TableCell  >Token</TableCell>
            {/* <TableCell>Logo</TableCell> */}
            <TableCell align="right" >Holding</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24h</TableCell>
            <TableCell align="right">Total </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallets
            .filter(token => token.balance > 0)
            .filter(token => token.dollarPrice > 0.0001)
            .sort(function (a, b) {
              return b.dollarPrice - a.dollarPrice;
            })
            .map((wallet, key) => (
              <TableRow key={key}>
                <TableCell className="table-row" >
                  <div className='token-display'>
                    <div className="image-token">
                      <img src={
                        wallet.urlLogo ? wallet.urlLogo :
                          'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
                      } alt={wallet.name} />
                    </div>

                    <div className="name-token">
                      {wallet.name}
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell>{wallet.currency}</TableCell> */}
                <TableCell align="right" className="table-row">{formatValues('price', wallet.balance)} {wallet.code}</TableCell>
                <TableCell align="right" className="table-row">
                  {formatValues('price', wallet.live_price)} $
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'right',
                    color: `${getColorValue(wallet.variation24h ?
                      (wallet.variation24h) :
                      (wallet.var24h ? (wallet.var24h.changeRate) : ''))}`
                  }}
                  className="table-row"
                >

                  {
                    wallet.variation24h ?
                      formatValues('pourcent', wallet.variation24h) :
                      (wallet.var24h ? formatValues('pourcent', wallet.var24h.changeRate) : '')
                  } %
                </TableCell>
                <TableCell className="table-row" align="right">{formatValues('price', wallet.dollarPrice)} $</TableCell>
              </TableRow>
            ))}


        </TableBody>

      </Table>
      <Loader />
    </React.Fragment >
  );
}
