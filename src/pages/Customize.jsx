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
import getPricesQuotesCMC from '../api/getPricesQuoteCMC';
import addCoinMarketCapIds from '../api/addCoinMarketCapIds';

const tokenList = JSON.parse(localStorage.getItem('GekocoinsData'));
// const tokenList = JSON.parse(localStorage.getItem('cmcTokensList'))
// console.log(tokenList);

const tokenListLabelise = () => {

  let res = tokenList.map((token) => {
    return { label: token.name, value: token.id };
  })


  res.push({ label: 'custom', image: 'toto', value: '0' });
  // console.log(res);
  return res;
}
const exchanges = ['crypto-com', 'gateio', 'coinbase', 'binance', 'kucoin'];
const labelList = tokenListLabelise();

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


const Customize = () => {

  const [token, setToken] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [exchange, setExchange] = React.useState('');
  const [exchangeId, setExchangeId] = React.useState(10);

  const handleChangeExchange = (event) => {

    console.log('event ', event.target.value);
    setExchangeId(event.target.value)
    let index = (event.target.value / 10) - 1;
    let ex = exchanges[index];
    console.log('ex', ex);
    setExchange(ex);
  };
  // Token input 
  const handleInput = (e) => {
    console.log('value', e.target.textContent);
    setToken(e.target.textContent);
  }

  const handleChangePrice = (e) => {
    console.log('value', e.target.value);
    setAmount(e.target.value);
  }

  const onSubmit = async (e) => {
    console.log(token, amount, exchange);
    let newEntries = { currency: token, amount: amount, exchange: exchange, balance: parseFloat(amount) };
    // todo recupere le tableau courant pour comparer 
    let tab = [];
    tab.push(newEntries);
    console.log('tab', tab);
    // add data id et price
    let wallet = await addCoinMarketCapIds(tab, exchange);
    wallet = await getPricesQuotesCMC(tab, exchange);
    console.log('new wallet', wallet);
    localStorage.setItem('wallet-custom', JSON.stringify(wallet));

  }

  React.useEffect(() => {
    console.log('Test use effect Customize');
    console.log(token);
  }, [token]);

  return (
    <Container component="main" sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: '30%',
      width: '100%'
    }}>

      <div>

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
            onChange={handleInput}
            // sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Token" />}
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
                <MenuItem name={element} value={index}>{element}</MenuItem>
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

      </div>

    </Container >
  );

};

export default Customize;