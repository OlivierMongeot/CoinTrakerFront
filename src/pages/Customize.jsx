// import getCoinMarketCapTokens from '../api/CoinMarketCap';

import React from 'react';
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
// import getPricesQuotesCMC from '../api/getPricesQuoteCMC';
// import addCoinMarketCapIds from '../api/addCoinMarketCapIds';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import { ToastContainer } from 'react-toastify';=

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  100: '#eaeef2',
  300: '#afb8c1',
  900: '#24292f',
};

const CustomButton = styled(ButtonUnstyled)(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${blue[500]};
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[100]};

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 3px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
  `,
);


// const tokenList = JSON.parse(localStorage.getItem('GekocoinsData'));
const tokenList = JSON.parse(localStorage.getItem('cmcTokensList'))
// console.log(tokenList);

const tokenListLabelise = () => {

  let res = tokenList.filter((token) => {
    return token.rank < 1000;
  })
    .sort(function (a, b) {
      return a.rank - b.rank;
    })
    .map((token) => {
      return { label: token.name, value: token.id, symbol: token.symbol, name: token.name, idCMC: token.id };
    })

  // res.push({ label: 'custom', image: 'toto', value: '0' });
  // console.log('token List used for form select', res);
  return res;
}
const exchanges = ['crypto-com', 'gateio', 'coinbase', 'binance', 'kucoin'];
// const labelList = tokenListLabelise();


const Customize = () => {

  const [token, setToken] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [exchange, setExchange] = React.useState('');
  const [exchangeId, setExchangeId] = React.useState(10);
  const [customWallet, setCustomWallet] = React.useState([])
  const [labelList, setLabelList] = React.useState([]);

  const handleChangeExchange = (event) => {

    console.log('event ', event.target.value);
    setExchangeId(event.target.value)
    let index = (event.target.value / 10) - 1;
    let ex = exchanges[index];
    console.log('ex', ex);
    setExchange(ex);
  };


  // Token input 
  const handleInputToken = (e) => {
    console.log('value token input : ', e.target.textContent);

    // // get the symbol of token 
    // const tokenName = e.target.textContent;

    // const tokenListCMC = labelList.filter((token) => {
    //   return token.label === tokenName;
    // })

    // console.log('tokenListCMC', tokenListCMC);

    setToken(e.target.textContent);
  }

  const handleChangePrice = (e) => {
    console.log('value', e.target.value);
    setAmount(e.target.value);
  }

  const onSubmit = async (e) => {
    // console.log('labelList', labelList);
    console.log('token', token);
    console.log('amount', amount);
    console.log('exchange', exchange);

    const numberAmount = (amount);
    let newEntries = [{ name: token, amount: amount, exchange: exchange, balance: numberAmount }];

    // Recupere le symbol avant d'aouter les data 
    // get the symbol of token 
    const tokenListCMC = labelList.filter((tok) => {
      return tok.label === token;
    })

    // const tokenListCMCCurrencies = tokenListCMC.map((token) => {
    //   return token.currency = token.symbol;
    // })
    for (let index = 0; index < tokenListCMC.length; index++) {
      const element = tokenListCMC[index];
      element.currency = element.symbol
    }

    console.log('NEW entry', newEntries);
    console.log('data token CMC', tokenListCMC);

    let merge = { ...newEntries[0], ...tokenListCMC[0] };

    console.log('merge', merge);


    // add data id et price
    let wallet = [merge];
    console.log('arrayMerged', wallet);
    // let wallet = await addCoinMarketCapIds(arrayMerged, exchange);

    // wallet = await getPricesQuotesCMC(wallet, exchange);
    // console.log('addCoinMarketCapIds new wallet', wallet);


    let tab = JSON.parse(localStorage.getItem('wallet-custom'));
    console.log('Tab before push ', tab)
    if (tab !== null) {
      tab.push(wallet[0]);
    } else {
      tab = wallet;

    }
    console.log('tab', tab);

    localStorage.setItem('wallet-custom', JSON.stringify(tab));
    setCustomWallet(tab);
  }



  React.useEffect(() => {
    console.log('use effect Customize');

    let walletCustom = (localStorage.getItem('wallet-custom'));
    // console.log('walletCustom ', walletCustom);
    if (walletCustom === null) {
      walletCustom = [];
    } else {
      walletCustom = JSON.parse(walletCustom);
      setCustomWallet(walletCustom);
    }

    const listParsed = tokenListLabelise();
    setLabelList(listParsed);

  }, []);

  return (
    <Container component="main" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }}>

      <div style={{
        marginTop: '50px', display: 'flex',
        flexDirection: 'row',
      }} >

        <FormControl sx={{
          m: 1, width: '200px'
        }}>
          {/* Token */}
          <Autocomplete
            sx={{
              m: 1, width: 'auto'
            }}
            freeSolo
            id="combo-box-demo"
            options={labelList}
            onChange={handleInputToken}
            // sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Token" symbol="Symbol" />}
          />
        </FormControl>


        <FormControl sx={{
          m: 1, width: '200px'
        }}>
          {/* Amount */}
          <TextField sx={{
            m: 1, width: '200px'
          }} id="outlined-basic" label="Amount" variant="outlined"
            onChange={handleChangePrice} />
        </FormControl>

        {/* Exchange */}

        <FormControl sx={{
          m: 2, width: '200px', mt: 2
        }}>
          <InputLabel id="demo-simple-select-standard-label">Exchange</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={exchangeId}
            onChange={handleChangeExchange}
            label="Exchange"
          >
            {exchanges.map((element, key) => {
              let index = (key + 1) * 10;
              return (
                <MenuItem key={key} name={element} value={index}>{element}</MenuItem>
              )
            })}

          </Select>
        </FormControl>

        <FormControl sx={{
          m: 1, width: '80px'
        }}>
          <Stack spacing={1} direction="row" sx={{
            mt: 2
          }}>
            <CustomButton
              onClick={onSubmit}
            >Add</CustomButton>
          </Stack>
        </FormControl>

      </div >




      <React.Fragment>

        <Table className="table-wallet" >
          <TableHead>
            <TableRow  >
              <TableCell >Token</TableCell>
              <TableCell align="right" >Balance</TableCell>
              <TableCell align="right">Exchange </TableCell>
              <TableCell align="right">Action </TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {customWallet && customWallet
              .map((wallet, key) => (
                <TableRow key={key}>
                  <TableCell className="table-row">
                    {wallet.name}
                  </TableCell>
                  <TableCell align="right" className="table-row">  {wallet.balance}</TableCell>
                  <TableCell align="right" className="table-row">  {wallet.exchange}</TableCell>
                  <TableCell align="right" className="table-row">
                    TdO
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </React.Fragment >


    </Container >
  );

};

export default Customize;