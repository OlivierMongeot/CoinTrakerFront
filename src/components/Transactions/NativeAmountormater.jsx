import * as React from 'react';
import LogoUSD from '../../images/usd.svg';
import LogoEur from '../../images/eur.svg';
import LogoKCS from '../../images/kcs.svg';
import LogoETH from '../../images/eth.png';
import LogoUSDT from '../../images/usdt.svg';
import LogoUSDC from '../../images/usdc.svg';

const nativeAmountFormater = (props) => {

  // console.log('native value ', props)

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

  if (props.value && props.value !== undefined && props.value.devises) {

    let swap = props.value.devises.usd;

    // console.log('devise swap : ', swap)

    let amount = parseFloat(props.value.amount) > 0 ? parseFloat(props.value.amount) : - parseFloat(props.value.amount);

    // console.log(amount, 'amount')

    let currency = props.value.currency;
    let logo = null;

    currency = 'EUR'
    swap = props.value.devises.eur;

    if (currency === 'EUR') {
      logo = LogoEur;
    }
    else if (currency.toLowerCase() === 'usd') {
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


    return (
      <div style={style}>
        <span > {(amount * swap).toFixed(2)} </span >
        <img
          className="logo-transac"
          src={logo}
          alt="Token" />
      </div>
    )


  }

  else {
    return (
      <div style={style}>
        <span > {100} </span >
        <img
          className="logo-transac"
          src={LogoKCS}
          alt="Token" />
      </div>
    )
  }

};

export default nativeAmountFormater;