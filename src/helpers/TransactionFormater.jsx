import * as React from 'react';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LogoDeposit from '../images/deposit.png';
import LogoWithdraw from '../images/withdraw.png';
import LogoSwap from '../images/swap.png';

const TransacFormater = (props) => {
  // console.log('props', props);
  if (props) {
    // 2022-08-03T08:53:58Z
    const type = props.value;
    // let logo = '';
    switch (type) {
      case 'deposit':
        return (
          <React.Fragment>
            <img
              className="logo-transac"
              src={LogoDeposit}
              alt="Token" />
            <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Deposit</div>
          </React.Fragment>

        )

      case 'withdraw':

        return (
          <React.Fragment>
            <img
              className="logo-transac"
              src={LogoWithdraw}
              alt="Token" />   <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Withdraw</div>
          </React.Fragment>
        )
      case 'trade':

        return (
          <React.Fragment>
            <img
              className="logo-transac"
              src={LogoSwap}
              alt="Token" />   <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Trade</div>
          </React.Fragment>
        )

      default:
        return (
          <SwapHorizIcon></SwapHorizIcon>
        )
    }



  }


};

export default TransacFormater;