import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import updateWallet from '../api/updateWallet';
import formatValues from '../helpers/formatValues';
// import { width } from '@mui/system';



export default function Ledger(props) {

  const [wallets, setWallets] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);

  let parentData = props.arrayAmountWallets;
  // console.log('parentdata Ledger', parentData);

  const updateWalletsAmount = (parentData, exchange, total) => {

    let exchangeInArray = false;
    for (let i = 0; i < parentData.length; i++) {
      if (parentData[i].exchange === exchange && exchange !== 'all') {
        parentData[i].amount = total;
        exchangeInArray = true;
      }
    }
    if (exchangeInArray === false && exchange !== 'all') {
      parentData.push({ exchange: exchange, amount: total });
    }
    if (exchange !== 'all') {
      localStorage.setItem('wallets-amount', JSON.stringify(parentData));
      props.setArrayAmountWallets(parentData);
    }

  }

  const setAndSaveTotalAllExchanges = (parentData) => {
    let acc = 0;
    for (let i = 0; i < parentData.length; i++) {
      let value = parentData[i].amount;
      if (parentData[i].exchange !== 'all') {
        acc += value;
      }

    }
    console.log('setTotalAllWallet', acc)
    localStorage.setItem('wallets-total', JSON.stringify(acc));
    props.setTotalAllWallet(acc);
  }

  const rotateSpinner = (exchangeName) => {
    const idElement = '#wallet-spinner';
    const spinnerElement = document.querySelector(idElement);
    spinnerElement.classList.add('show');
    spinnerElement.classList.remove('hide');
  }

  const stopSpinner = (exchangeName) => {
    const idElement = '#wallet-spinner';
    const spinnerElement = document.querySelector(idElement);
    spinnerElement.classList.remove('show');
    spinnerElement.classList.add('hide');
  }

  const getCompletedWallet = async (exchange, exchanges) => {

    // console.log('All Exchanges', exchanges)

    rotateSpinner(exchange);
    let result = await updateWallet(exchange, exchanges);
    stopSpinner(exchangeName);
    localStorage.setItem('wallet-' + exchange, JSON.stringify(result));
    console.log('Result updateWallet', result)
    setWallets(result);

    props.setUpdatedAt(formatValues('timestamp', result[0].timestamp));

    // Calcul le total pour les props
    let arrayTotalExchange = [];
    result.forEach(element => {
      arrayTotalExchange.push(element.balance * element.live_price);
    });

    let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
    console.log('Updated total exchange', total);

    props.setTotalExchange(total);
    // Set Total In Local Storage 
    localStorage.setItem('total-' + exchange, JSON.stringify(total));

    updateWalletsAmount(parentData, exchange, total);

    setAndSaveTotalAllExchanges(parentData);
  }

  const valueDollarToDisplay = (exchangeName) => {
    if (exchangeName === 'all') {
      return 1;
    } else {
      return 0.0001;
    }

  }
  React.useEffect(() => {
    // Check if user is authenticated todo
    // if(!AuthenticationService.isAuthenticated){
    //     console.log(AuthenticationService.isAuthenticated);
    //     window.location.href = '/login';
    // }
    console.log('_____________________________')
    console.log('Wallet useEffect exchange : ', 'wallet-' + exchangeName);

    getCompletedWallet(exchangeName, parentData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);



  return (
    <React.Fragment>
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
            .filter(token => (token.balance * token.live_price) > valueDollarToDisplay(exchangeName))
            .sort(function (a, b) {
              return b.dollarPrice - a.dollarPrice;
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
                      (''))} %
                </TableCell>


                <TableCell
                  style={{

                    textAlign: 'right',
                    color: `${formatValues('switch-color', wallet.quoteCMC ?
                      (wallet.quoteCMC.USD.percent_change_24h) :
                      (wallet.quoteAPIorigin ? (wallet.quoteAPIorigin.changeRate) : ''))}`
                  }}
                  className="table-row change">
                  {(wallet.quoteCMC) ?
                    (formatValues('pourcent', wallet.quoteCMC.USD.percent_change_24h)) :
                    (wallet.quoteAPIorigin ? formatValues('pourcent', wallet.quoteAPIorigin.changeRate) :
                      (''))} %
                </TableCell>
                <TableCell
                  style={{
                    width: "5%",
                    textAlign: 'right',
                    color: `${formatValues('switch-color', wallet.quoteCMC ?
                      (wallet.quoteCMC.USD.percent_change_7d) :
                      (wallet.quoteAPIorigin ? (wallet.quoteAPIorigin.changeRate) : ''))}`
                  }}
                  className="table-row change">
                  {(wallet.quoteCMC) ?
                    (formatValues('pourcent', wallet.quoteCMC.USD.percent_change_7d)) :
                    (wallet.quoteAPIorigin ? formatValues('pourcent', wallet.quoteAPIorigin.changeRate) :
                      (''))} %
                </TableCell>

                <TableCell className="table-row" align="right">{formatValues('price', (wallet.live_price * wallet.balance))} $</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </React.Fragment >
  );
}
