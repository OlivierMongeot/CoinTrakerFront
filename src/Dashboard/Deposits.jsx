import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import formatValues from '../helpers/formatValues'
import Loader from '../helpers/Loader';
// import { width } from '@mui/system';


export default function Deposits(props) {
  // console.log(props);
  return (
    <React.Fragment>


      {props.arrayAmountWallets && props.arrayAmountWallets.map((wallet, index) => (

        <div key={index} className="display-grid-amount">

          <div>
            {formatValues('camelise', wallet.exchange)}
          </div>
          <div>
            <div className="price-loader-content">
              <Loader fontSize='30' exchange={wallet.exchange} />
              <div>
                {Math.round(wallet.amount)} $
              </div>
            </div>
          </div>
        </div>

      )
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

      }}>
        <Title>Total Wallets</Title>

        <Typography component="p" variant="h4" style={{


        }}>
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

    </React.Fragment>
  );
}
