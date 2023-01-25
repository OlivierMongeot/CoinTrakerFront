import * as React from 'react';
import IconeEur from '../IconesSVG/IconeEur';
import IconeUsd from '../IconesSVG/IconeUsd';
import IconeUsdt from '../IconesSVG/IconeUsdt';
import IconeBitcoin from '../IconesSVG/IconeBitcoin';
import IconeEtherum from '../IconesSVG/IconeEtherum';
import IconeUSDC from '../IconesSVG/IconeUSDC';
import IconeKCS from '../IconesSVG/IconeKCS'
import IconeNear from '../IconesSVG/IconeNear';
import IconeSolana from '../IconesSVG/IconeSolana';
import IconeJPG from '../IconesJPG/IconeJPG';
import IconeXRP from '../IconesSVG/IconXrp';

const BadgeFormater = (props) => {

  if (props) {
    // 2022-08-03T08:53:58Z
    const amount = props.value?.amount;
    const currency = props.value.currency;
    let url = props.value.urlLogo;

    if (url !== null) {
      // console.log('props', props);
    }


    let value = (parseFloat(amount));
    if (value === 0) {
      return (
        <span></span>
      )
    }
    if (value < 0.01 && value > -0.01) {
      value = value.toFixed(6)
    } else if (value < 0.1 && value > -0.1) {
      value = value.toFixed(5)
    } else if (value < 0.9 && value > -0.9) {
      value = value.toFixed(3)
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
      boxShadow: '1px 1px 3px ' + color,
      height: '1.9rem'
    }

    switch (currency) {
      case 'EUR':
      case 'eur':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeEur></IconeEur>
          </div>
        )

      case 'USD':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeUsd></IconeUsd>
          </div>
        )

      case 'USDT':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeUsdt></IconeUsdt>
          </div>
        )
      case 'BTC':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeBitcoin></IconeBitcoin>
          </div>
        )
      case 'USDC':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeUSDC></IconeUSDC>
          </div>
        )
      case 'KCS':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeKCS></IconeKCS>
          </div>
        )

      case 'ETH':
      case 'ETH2':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeEtherum></IconeEtherum>
          </div>
        )

      // case 'NEAR':
      //   return (
      //     <div style={style}>
      //       <span > {value} {currency}</span >
      //       <IconeNear></IconeNear>
      //     </div>
      //   )

      case 'SOL':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            {/* <IconeJPG></IconeJPG> */}
            <IconeSolana></IconeSolana>

          </div>
        )

      case 'XRP':
        return (
          <div style={style}>
            <span > {value} {currency}</span >
            <IconeXRP></IconeXRP>
          </div>
        )




      default:
        break
    }

    return (
      <div style={style}>
        <span > {value} {currency}</span >
        <img style={{ height: '20px', width: '20px', marginLeft: '5px' }}
          src={url}
          alt="Token" />
      </div>
    )



  }

};

export default BadgeFormater;