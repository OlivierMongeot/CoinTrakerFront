import * as React from 'react';
import LogoUSD from '../../images/usd.svg';
import LogoEUR from '../../images/eur.svg'
import LogoUSDT from '../../images/usdt.svg';
import LogoKCS from '../../images/kcs.svg';
import LogoUSDC from '../../images/usdc.svg';
import LogoETH from '../../images/eth.png';


const BadgeFormater = (props) => {
  // console.log('props', props);
  if (props) {
    // 2022-08-03T08:53:58Z
    const amount = props.value?.amount;
    const currency = props.value.currency;
    let url = props.value.urlLogo;



    let value = (parseFloat(amount));
    if (value === 0) {
      return (
        <span></span>
      )
    }
    if (value < 0.1 && value > -0.1) {
      value = value.toFixed(5)
    } else {
      value = value.toFixed(2)
    }
    let color = 'black'
    if (props.type === 'cashin') {
      color = '#7CE400'
    } else {
      color = '#E1472E'
    }

    const style = {
      // backgroundColor: color,
      border: '1px solid black',
      borderRadius: '50px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '2px 2px 5px ' + color,
      height: '1.9rem'
    }

    switch (currency) {
      case 'EUR':
        url = LogoEUR
        break
      case 'USD':
        url = LogoUSD
        break

      case 'USDT':
        url = LogoUSDT
        break

      case 'USDC':
        url = LogoUSDC
        break

      case 'KCS':
        url = LogoKCS
        break
      case 'ETH':
        url = LogoETH
        break

      default:
        break
    }

    return (
      <div style={style}>
        <span > {value} {currency}</span >
        <img
          className="logo-transac"
          src={url}
          alt="Token" />
      </div>
    )



  }

};

export default BadgeFormater;