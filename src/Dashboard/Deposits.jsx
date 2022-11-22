import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import formatValues from '../helpers/formatValues'

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  // console.log(props);
  return (
    <React.Fragment>
      <Title>Total Deposits</Title>
      <Typography component="p" variant="h4">
        ${formatValues('price', props.totalAllWallet)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
      </Typography>
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View details balance
        </Link>
      </div> */}
      {props.arrayAmountWallets && props.arrayAmountWallets.map((wallet, index) => (
        <div key={index} className="display-grid-amount">
          <div>
            {formatValues('camelise', wallet.exchange)}
          </div>
          <div>
            {formatValues('price', wallet.amount)} $
          </div>
        </div>



      ))}
    </React.Fragment>
  );
}
