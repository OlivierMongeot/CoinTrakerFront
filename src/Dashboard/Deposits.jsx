import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import formatValues from '../helpers/formatValues'
import Loader from '../helpers/Loader';
// import { width } from '@mui/system';
import Divider from '@mui/material/Divider';
import { useRef, useEffect } from 'react';

export default function Deposits(props) {

  const ref = useRef(null);

  useEffect(() => {

    const handleClick = event => {
      console.log('Button over');
      // const spinners = document.querySelectorAll('.spinner-loader');
      console.log(event.target);

    };

    const elements = document.querySelectorAll('.display-grid-inline');
    console.log(elements);

    // element.addEventListener('click', handleClick);
    elements.forEach((element) => {
      element.addEventListener('mouseover', handleClick);
    })

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('mouseover', handleClick);
      })
    };
  }, []);

  // console.log(props);
  return (
    <React.Fragment>


      {props.arrayAmountWallets && props.arrayAmountWallets.map((wallet, index) => (

        <div key={index} className="display-grid-amount">
          <div className="display-grid-inline">
            <Loader fontSize='30' exchange={wallet.exchange} className='spinner-loader' />
            <div>
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
          ${formatValues('price', props.totalAllWallet)}
        </Typography>

        {/* <Typography color="text.secondary" sx={{ flex: 1 }}>
        </Typography> */}
      </div>

      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View details balance
        </Link>
      </div> */}

    </React.Fragment >
  );
}
