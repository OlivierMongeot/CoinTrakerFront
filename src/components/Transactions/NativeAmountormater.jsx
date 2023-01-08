import * as React from 'react';

import LogoKCS from '../../images/kcs.svg';
import LogoUSDT from '../../images/usdt.svg';
import LogoUSDC from '../../images/usdc.svg';
import Loader from '../TrxLoader';
import IconeUsd from '../Icones/IconeUsd';
import IconeEur from '../Icones/IconeEur';
import IconeEtherum from '../Icones/IconeEtherum'


const nativeAmountFormater = (props) => {

  // console.log('native value ', props)

  const style = {
    border: '1px solid black',
    borderRadius: '50px',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '2px 2px 5px grey',
    height: '1.9rem',
  }

  const main = {
    display: 'flex',
    flexDirection: 'row'
  }

  if (props.value && props.value !== undefined && props.value.devises) {

    let swap = props.value.devises.usd;

    // console.log('devise swap : ', swap)

    let amount = parseFloat(props.value.amount) > 0 ? parseFloat(props.value.amount) : - parseFloat(props.value.amount);

    // console.log(amount, 'amount')

    let currency = props.value.currency;
    // let logo = null;

    currency = 'EUR'
    swap = props.value.devises.eur;

    switch (currency) {
      case 'EUR':
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(4)} </span >
              <IconeEur></IconeEur>
            </div>
            <div style={style}>
              <span > {(amount).toFixed(4)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )
      case 'usd':
      case 'USD':
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(5)} </span >
              <IconeUsd></IconeUsd>
            </div>
            <div style={style}>
              <span > {(amount).toFixed(2)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )

      case 'USDT':
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(2)} </span >
              <img
                className="logo-transac"
                src={LogoUSDT}
                alt="Token" />
            </div>
            <div style={style}>
              <span > {(amount).toFixed(2)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )
      case 'KCS':
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(2)} </span >
              <img
                className="logo-transac"
                src={LogoKCS}
                alt="Token" />
            </div>
            <div style={style}>
              <span > {(amount).toFixed(2)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )

      case 'ETH':
        console.log('ETH')
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(2)} </span >
              <IconeEtherum></IconeEtherum>
            </div>
            <div style={style}>
              <span > {(amount).toFixed(2)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )
      case 'USDC':
        return (
          <div style={main}>
            <div style={style}>
              <span > {(amount * swap).toFixed(2)} </span >
              <img
                className="logo-transac"
                src={LogoUSDC}
                alt="Token" />
            </div>
            <div style={style}>
              <span > {(amount).toFixed(2)} </span >
              <IconeUsd></IconeUsd>
            </div>
          </div>
        )

      default:
        break;
    }


  }

  else {
    return (
      < React.Fragment >
        <Loader />
      </React.Fragment>
    )
  }

};

export default nativeAmountFormater;