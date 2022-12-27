import * as React from 'react';
import LogoUSD from '../images/usd.svg';
import LogoEur from '../images/eur.svg';

const nativeAmountFormater = (props) => {

  if (props) {
    // 2022-08-03T08:53:58Z
    let amount = props.value.amount > 0 ? props.value.amount : - props.value.amount;
    let currency = props.value.currency;
    let logo = null;
    if (currency === 'EUR') {
      logo = LogoEur;
    } else if (currency === 'USD') {
      logo = LogoUSD;
    } else {
      console.log('error : no logo for this FIAT')
    }

    return (
      <React.Fragment>
        <span > {amount} </span >
        <img
          className="logo-transac"
          src={logo}
          alt="Token" />
      </React.Fragment>
    )


  }


};

export default nativeAmountFormater;