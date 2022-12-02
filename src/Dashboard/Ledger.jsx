import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import formatValues from '../helpers/formatValues';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shouldIUpdate from '../helpers/shouldIUpdate'
import addCoinMarketCapQuote from '../api/getPricesQuoteCMC';
import setupBalanceStorage from '../helpers/setupBalanceStorage';
import minValueDollarToDisplayToken from '../helpers/minValueDollarToDisplayToken';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';
import updateWalletAmountInLS from '../helpers/updateWalletAmountInLS';
import setAndSaveTotalAllWallets from '../helpers/setAndSaveTotalAllWallets';
import rotateSpinner from '../helpers/rotateSpinner';
import stopSpinner from '../helpers/stopSpinner';
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';


export default function Ledger(props) {

  const [wallets, setWallets] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);

  let parentData = props.arrayAmountWallets;
  const exchagesEnable = props.exchanges;

  const navigate = useNavigate();

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

  const updateGeneralWallet = (newExchangeData, exchange) => {

    let currentGeneralWallet = JSON.parse(localStorage.getItem('wallet-all'));
    // console.log('currentGeneralWallet ', currentGeneralWallet);

    // Suprime les ancienne data de l'echange en cours d'update
    let newDatafilterd = currentGeneralWallet.filter((element) => element.exchange !== exchange);

    // console.log('currentGeneralWallet after filter ' + exchange + ' elements', newDatafilterd);

    let finalRes = newDatafilterd.concat(newExchangeData);
    console.log('finalRes', finalRes);
    localStorage.setItem('wallet-all', JSON.stringify(finalRes));
    return finalRes;
  }



  const updateProcess = async (exchange, parentData, props, updateAll) => {
    console.log('update process', exchange);

    const completeDataWallet = async (wallet, exchange) => {

      const setTotalBalanceWallet = (wallet, exchange) => {
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
        setTotalBalanceWallet(wallet, exchange);
        return wallet;
      } else {
        return false;
      }
    }


    // console.log('updateProcess', exchange)
    let shoudIUpdate = shouldIUpdate(exchange);

    if (shoudIUpdate) {
      rotateSpinner(exchange, parentData);
      // let rowResult = await apiCall(exchange);
      console.log('API CALL');
      let url = "http://192.168.0.46:4000/" + exchange + "/wallet";
      let user = JSON.parse(localStorage.getItem('user'));
      let jws = user.token;
      console.log('token used for connection', jws);

      fetch(url, {
        method: 'GET',
        headers: {
          'authorization': jws
        }
      }).then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          if (data.data && data.data.message === 'jwt expired') {
            // console.log('token expired', data.data);
            toast("Token expired ! Please log in ");
            stopSpinner(exchange, parentData);
            console.log('redirect');
            navigate("/login");
            return false;
          }
          completeDataWallet(data, exchange)
            .then((data) => {
              console.log('completeData after', data);
              let result = data;
              if (result) {
                let total = totalExchange(result);
                // console.log('props', props);
                props.setTotalExchange(total);
                // Set Total In Local Storage 
                localStorage.setItem('total-' + exchange, JSON.stringify(total));

                updateWalletAmountInLS(parentData, exchange, total);

                setAndSaveTotalAllWallets(parentData, props);

                localStorage.setItem('wallet-' + exchange, JSON.stringify(result));

                if (updateAll === false) {
                  console.log('displat one wallet');
                  setWallets(result);
                  // Traitement du wallet general 
                  updateGeneralWallet(result, exchange);

                  props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));

                } else if (updateAll === true) {

                  let allWallet = updateGeneralWallet(result, exchange);
                  console.log('display all wallet');
                  setWallets(allWallet);
                }
                stopSpinner(exchange, parentData);
              } else {
                // If no result
                stopSpinner(exchange, parentData);
                // alert('this gestion is todo : Ledger ligne 146');
                return false;
              }

            })
        })
        .catch((error) => {
          console.error('Error:', error);
          return error;
        });

    } else {
      // No update required : display from LS
      if (updateAll) {
        // return false;
        console.log('set wallet all from Local store')
        setWallets(JSON.parse(localStorage.getItem('wallet-all')));
        props.setTotalExchange(JSON.parse(localStorage.getItem('total-' + exchange)));
      } else {
        console.log('set wallet ' + exchange + ' from Local store')
        setWallets(JSON.parse(localStorage.getItem('wallet-' + exchange)));

        props.setTotalExchange(JSON.parse(localStorage.getItem('total-' + exchange)));
      }

    }
  }


  const getCompletedExchange = async (exchange, exchanges) => {

    switch (exchange) {
      case 'all':
        for (let i = 0; i < exchanges.length; i++) {
          if (exchanges[i] !== 'all') {
            console.log(exchanges[i])
            updateProcess(exchanges[i], parentData, props, true);
          }
        }
        // let res = JSON.parse(localStorage.getItem('wallet-all'));
        // setWallets(res);
        // let total = totalExchange(res);
        // props.setTotalExchange(total);
        // console.log('update all finish')
        break;

      default:
        updateProcess(exchange, parentData, props, false);
        console.log('update simple finish')
        break;
    }

  }


  React.useEffect(() => {

    console.log('_____________________________')
    console.log('Wallet useEffect exchange : ', 'wallet-' + exchangeName);

    getCompletedExchange(exchangeName, exchagesEnable);

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
                    <Tooltip title={wallet.exchange}>
                      <div style={{
                        fontSize: 'small'
                      }}
                        className="name-token">

                        {wallet.name} ({wallet.exchange})

                      </div>
                    </Tooltip>
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
