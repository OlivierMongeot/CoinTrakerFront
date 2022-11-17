import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

import updateWallet from '../helpers/updateWallet';



// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  [
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44
  ],
  [
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ]];


function preventDefault(event) {
  event.preventDefault();
}

export default function Ledger(props) {
  console.log(props);


  const [wallets, setWallets] = React.useState([]);
  const [exchangeName] = React.useState(props.exchange);
  const [totalExchange, setTotalExchange] = React.useState(0);

  let parentData = props.arrayAmountWallets;

  const updateParentData = (parentData, exchange, total) => {
    if (parentData.length > 0) {
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
    } else {
      parentData.push({ exchange: exchange, amount: total });
    }
    props.setArrayAmountWallets(parentData);
  }

  const calculTotalGeneral = (parentData) => {
    let acc = 0;
    for (let i = 0; i < parentData.length; i++) {
      let value = parentData[i].amount;
      acc += value;
    }
    console.log('setTotalAllWallet', acc)
    props.setTotalAllWallet(acc);
  }

  const getWallet = async (exchange, fromApi = true) => {
    console.log("getWallet from api : ", fromApi);
    let result = null;
    switch (fromApi) {
      case true:
        result = await updateWallet(exchange);
        // sAve in LOcal Store
        localStorage.setItem('wallet-' + exchange, JSON.stringify(result));
        break;
      case false:
        result = JSON.parse(localStorage.getItem('wallet-' + exchange));
        break;
      default:
        result = JSON.parse(localStorage.getItem('wallet-' + exchange));
        break;
    }
    console.log('setWallet', result);
    setWallets(result);

    // Calcul le total 
    let arrayTotalExchange = [];
    result.forEach(element => {
      arrayTotalExchange.push(element.dollarPrice);
    });

    let total = arrayTotalExchange.reduce((acc, val) => acc + val, 0)
    console.log('Updated total exchange', total);

    setTotalExchange(total)
    // Set Total In Local Storage 
    localStorage.setItem('total-' + exchange, JSON.stringify(total));

    updateParentData(parentData, exchange, total);

    calculTotalGeneral(parentData);
  }




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
    console.log('Wallet is empty', isEmpty);

    if (walletLocalStorage === null || isEmpty) {
      console.log('No wallet in storage for ' + exchangeName);
      getWallet(exchangeName, true);

    } else {
      console.log('Wallet in LocalStorage for ' + exchangeName + ', check timestamp creation');
      // check if last update > 1 hour
      let dateLastUpdate = walletLocalStorage[0].timestamp // timestamp
      let dateNow = new Date().getTime();
      let difference = dateNow - dateLastUpdate;
      if (difference > 180000) {
        console.log('Time > 3 min , update Wallet after display old value');
        getWallet(exchangeName, true,);
      } else {
        console.log('Time < 3 min hour, Display Wallet from Local Store : ' + exchangeName, walletLocalStorage);
        // getWallet(exchangeName, false);
        getWallet(exchangeName, true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);



  return (
    <React.Fragment>
      <Title>Wallets amount {props.exchange}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Value</TableCell>
            <TableCell align="right">Total $</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, key) => (
            <TableRow key={row[key]}>
              <TableCell>{row[0]}</TableCell>
              <TableCell>{row[1]}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
