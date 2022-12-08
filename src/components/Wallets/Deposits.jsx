import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import formatValues from '../../helpers/formatValues';
import Loader from '../../components/Loader';
import Divider from '@mui/material/Divider';
import { useEffect } from 'react';
import updateProcess from '../../api/updateProcess';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Deposits(props) {

  console.log(props);

  const getTotal = (wallets) => {
    let acc = 0;
    for (let i = 0; i < wallets.length; i++) {
      let value = wallets[i].amount;
      acc += value;
    }
    return acc;
  }

  const total = getTotal(props.arrayAmountWallets);


  useEffect(() => {

    const handleClick = $event => {
      const exchange = $event.target.outerText;
      console.log('exchange click ', exchange);
      // updateProcess(exchange, props.arrayAmountWallets, false, true)
      toast('test click '
        + exchange);

      // Make update force 
    };

    const elements = document.querySelectorAll('.display-grid-inline');

    elements.forEach((element) => {
      element.addEventListener('click', handleClick);
    })

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('click', handleClick);
      })
    };
  }, [props.arrayAmountWallets]);


  return (
    <React.Fragment>
      <ToastContainer />
      {props.arrayAmountWallets && props.arrayAmountWallets.map((wallet, index) => (

        <div key={index} className="display-grid-amount">
          <div className="display-grid-inline">
            <Loader fontSize='30' exchange={wallet.exchange} className='spinner-loader' />
            <div className='exchange-total'>
              {formatValues('camelise', wallet.exchange)}
            </div>
          </div>

          <div>
            <div className="price-loader-content">
              {/* <Loader fontSize='30' exchange={wallet.exchange} /> */}
              <div>
                {Math.round(wallet.amount)} $
              </div>
            </div>
          </div>
        </div>
      )
      )}
      <Divider light />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10
      }}>
        <Title>Total Wallets</Title>

        <Typography component="p" variant="h4" >
          ${formatValues('price', total)}
        </Typography>


      </div>


    </React.Fragment >
  );
}
