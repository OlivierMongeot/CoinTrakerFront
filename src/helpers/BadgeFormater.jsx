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

    if (currency === 'EUR') {
      return (
        <React.Fragment>
          <span > {value} {currency}</span >
          <img
            className="logo-transac"
            src={LogoEUR}
            alt="Token" />
        </React.Fragment>
      )
    }
    if (currency === 'USD') {
      return (
        <React.Fragment>
          <span > {value} {currency}</span >
          <img
            className="logo-transac"
            src={LogoUSD}
            alt="Token" />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <span > {value} {currency}</span >
        <img
          className="logo-transac"
          src={url}
          alt="Token" />
      </React.Fragment>
    )


  }


};

export default BadgeFormater;