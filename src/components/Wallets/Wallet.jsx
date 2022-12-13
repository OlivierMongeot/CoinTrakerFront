import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import formatValues from '../../helpers/formatValues';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import minValueDollarToDisplayToken from '../../helpers/minValueDollarToDisplayToken';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import AuthenticationService from '../../helpers/AuthService';
import updateProcess from '../../api/updateProcess';

export default function Wallet(props) {

  const navigate = useNavigate();

  let wallet = props.wallet;
  let setWallet = props.setWallet
  // const [wallet, setWallet] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);

  const exchangesEnable = props.exchanges;


  React.useEffect(() => {

    console.log('_____________________________')
    console.log('Wallet useEffect exchange : ', 'wallet-' + exchangeName);
    console.log('isAuthenticated : ', AuthenticationService.isAuthenticated)

    if (AuthenticationService.isAuthenticated) {

      let arrayAmountWallets = props.arrayAmountWallets;

      switch (exchangeName) {
        case 'all':
          for (let i = 0; i < exchangesEnable.length; i++) {
            if (exchangesEnable[i] !== 'all') {
              updateProcess(exchangesEnable[i], arrayAmountWallets, true)
                .then(
                  (data) => {
                    if (data === 'TokenExpiredError') {
                      navigate("/login");
                      return;
                    } else if (data === 'no-user') {
                      navigate("/login");
                      return;
                    }
                    setWallet(data);
                  }
                )
            }
          }
          break;

        default:
          updateProcess(exchangeName, arrayAmountWallets, false)
            .then(
              (data) => {
                if (data === 'TokenExpiredError') {
                  navigate("/login");
                  return;
                } else if (data === 'no-user') {
                  navigate("/login");
                  return;
                }
                setWallet(data);
              }
            )
          break;
      }

    } else {
      navigate("/login");
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);

  return (
    <React.Fragment>
      <ToastContainer />
      <Table className="table-wallet" >
        <TableHead>
          <TableRow align="right" >
            <TableCell >Token</TableCell>
            <TableCell align="right" >Balance</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">1h %</TableCell>
            <TableCell align="right">24h %</TableCell>
            <TableCell align="right">7j % </TableCell>
            <TableCell align="right">30j % </TableCell>
            <TableCell align="right">Total </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={exchangeName + ' table-wallet'}>
          {wallet && wallet
            .filter(token => token.balance > 0)
            .filter(token => (token.balance * token.live_price) > minValueDollarToDisplayToken(exchangeName))
            .sort(function (a, b) {
              return b.balance * b.live_price - a.balance * a.live_price;
            })
            .map((walletElement, key) => (
              <TableRow key={key}>
                <TableCell
                  style={{

                  }}
                  className="table-row" >
                  <Tooltip title={formatValues('camelise', walletElement.exchange)}>

                    <div style={{
                      margin: '0'
                    }}
                      className='token-display'>
                      <div className="image-token">
                        <img src={
                          walletElement.urlLogo ? walletElement.urlLogo :
                            'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
                        } alt={walletElement.name} />
                      </div>

                      <div style={{
                        fontSize: 'small', marginRight: '10px'
                      }}
                        className="name-token">

                        {walletElement.name}
                      </div>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell align="right" className="table-row">{formatValues('price', walletElement.balance)} {walletElement.code}</TableCell>
                <TableCell align="right" className="table-row">
                  {formatValues('price', walletElement.live_price)} $
                </TableCell>

                <TableCell
                  style={{

                    textAlign: 'right',
                    color: `${formatValues('switch-color', walletElement.quoteCMC ?
                      (walletElement.quoteCMC.USD.percent_change_1h) :
                      (walletElement.quoteAPIorigin ? (walletElement.quoteAPIorigin.changeRate) : ''))}`
                  }}
                  className="table-row change">
                  {(walletElement.quoteCMC) ?
                    (formatValues('pourcent', walletElement.quoteCMC.USD.percent_change_1h)) :
                    (walletElement.quoteAPIorigin ? formatValues('pourcent', walletElement.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>


                <TableCell
                  style={{

                    textAlign: 'right',
                    color: `${formatValues('switch-color', walletElement.quoteCMC ?
                      (walletElement.quoteCMC.USD.percent_change_24h) :
                      (walletElement.quoteAPIorigin ? (walletElement.quoteAPIorigin.changeRate) : '...'))}`
                  }}
                  className="table-row change">
                  {(walletElement.quoteCMC) ?
                    (formatValues('pourcent', walletElement.quoteCMC.USD.percent_change_24h)) :
                    (walletElement.quoteAPIorigin ? formatValues('pourcent', walletElement.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>
                <TableCell
                  style={{
                    width: "5%",
                    textAlign: 'right',
                    color: `${formatValues('switch-color', walletElement.quoteCMC ?
                      (walletElement.quoteCMC.USD.percent_change_7d) :
                      (walletElement.quoteAPIorigin ? (walletElement.quoteAPIorigin.changeRate) : '...'))}`
                  }}
                  className="table-row change">
                  {(walletElement.quoteCMC) ?
                    (formatValues('pourcent', walletElement.quoteCMC.USD.percent_change_7d)) :
                    (walletElement.quoteAPIorigin ? formatValues('pourcent', walletElement.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>
                <TableCell
                  style={{
                    width: "5%",
                    textAlign: 'right',
                    color: `${formatValues('switch-color', walletElement.quoteCMC ?
                      (walletElement.quoteCMC.USD.percent_change_30d) :
                      (walletElement.quoteAPIorigin ? (walletElement.quoteAPIorigin.changeRate) : '...'))}`
                  }}
                  className="table-row change">
                  {(walletElement.quoteCMC) ?
                    (formatValues('pourcent', walletElement.quoteCMC.USD.percent_change_30d)) :
                    (walletElement.quoteAPIorigin ? formatValues('pourcent', walletElement.quoteAPIorigin.changeRate) :
                      ('...'))} %
                </TableCell>

                <TableCell className="table-row" align="right">{formatValues('price', (walletElement.live_price * walletElement.balance))} $</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </React.Fragment >
  );
}
