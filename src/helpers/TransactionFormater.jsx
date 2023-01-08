import * as React from 'react';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import IconeDeposit from '../components/Icones/IconeDeposit';
import IconeWithdraw from '../components/Icones/IconeWidthdraw';
import IconeSwap from '../components/Icones/IconeSwap';

const TransacFormater = (props) => {
  // console.log('props', props);
  if (props) {
    // 2022-08-03T08:53:58Z
    const type = props.value;
    // let logo = '';
    switch (type) {
      case 'deposit':
      case 'Deposit':
        return (
          <React.Fragment>
            <IconeDeposit></IconeDeposit>
            <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Deposit</div>
          </React.Fragment>
        )

      case 'withdraw':
      case 'withdrawals':
        return (
          <React.Fragment>
            <IconeWithdraw></IconeWithdraw>
            <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Withdraw</div>
          </React.Fragment>
        )

      case 'trade':
        return (
          <React.Fragment>
            <IconeSwap></IconeSwap>
            <div style={{ marginLeft: '5px', fontSize: '0.8rem' }}>Trade</div>
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