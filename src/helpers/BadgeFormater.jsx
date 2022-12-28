import * as React from 'react';
import LogoUSD from '../images/usd.svg';
import LogoEUR from '../images/eur.svg';

const BadgeFormater = (props) => {
  // console.log('props', props);
  if (props) {
    // 2022-08-03T08:53:58Z
    const amount = props.value.amount;
    const currency = props.value.currency;
    const url = props.value.urlLogo;


    let value = (parseFloat(amount));
    if (value === 0) {
      return (
        <span > </span >
      )
    }
    if (value < 0.1 && value > -0.1) {
      value = value.toFixed(5)
    } else {
      value = value.toFixed(2)
    }
    let color = 'black'
    if (props.type === 'cashin') {
      color = 'green'
    } else {
      color = 'red'
    }

    const style = {
      // backgroundColor: color,
      border: '1px solid black',
      borderRadius: '50px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '2px 2px 5px ' + color
    }

    if (currency === 'EUR') {
      return (
        <div style={style}>
          <span >{value} {currency}</span >
          <img
            className="logo-transac"
            src={LogoEUR}
            alt="Token" />
        </div>
      )
    }
    if (currency === 'USD') {
      return (
        <div style={style}>
          <span > {value} {currency}</span >
          <img
            className="logo-transac"
            src={LogoUSD}
            alt="Token" />
        </div>
      )
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