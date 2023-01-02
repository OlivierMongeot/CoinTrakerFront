import * as React from 'react';
import LogoUSD from '../../images/usd.svg';
import LogoEur from '../../images/eur.svg';
import LogoKCS from '../../images/kcs.svg';
import LogoETH from '../../images/eth.png';
import LogoUSDT from '../../images/usdt.svg';
import LogoUSDC from '../../images/usdc.svg';

const nativeAmountFormater = (props) => {


  if (props) {

    let amount = parseFloat(props.value.amount) > 0 ? parseFloat(props.value.amount) : - parseFloat(props.value.amount);
    let currency = props.value.currency;
    let logo = null;

    if (currency === 'EUR') {
      logo = LogoEur;
    }
    else if (currency === 'USD') {
      logo = LogoUSD;
    }
    else if (currency === 'USDT') {
      logo = LogoUSDT;
    }
    else if (currency === 'KCS') {
      logo = LogoKCS;
    } else if (currency === 'ETH') {
      logo = LogoETH;
    } else if (currency === 'USDC') {
      logo = LogoUSDC;
    } else {
      console.log('nativeAmountFormater : no logo for this FIAT ', currency)
      logo = '';
    }

    const style = {
      // backgroundColor: color,
      border: '1px solid black',
      borderRadius: '50px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '2px 2px 5px grey',
      height: '1.9rem'
    }

    return (
      <div style={style}>
        <span > {amount.toFixed(3)} </span >
        <img
          className="logo-transac"
          src={logo}
          alt="Token" />
      </div>
    )
  }
};

export default nativeAmountFormater;