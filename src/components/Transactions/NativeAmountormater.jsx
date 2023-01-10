import * as React from 'react';

import Loader from './TrxLoader';
import IconeUsd from '../Icones/IconeUsd';
import IconeEur from '../Icones/IconeEur';


const nativeAmountFormater = (props) => {

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

    let swapEur = props.value.devises.eur;
    let swap = props.value.devises.usd;
    // let swapDIRAM = props.value.devises['usd'];
    // console.log(swapDIRAM)
    // console.log('native value ', props.value)
    // console.log('devise swap : ', swap)

    let amount = parseFloat(props.value.amount) > 0 ? parseFloat(props.value.amount) : - parseFloat(props.value.amount);


    // let currency = props.value.currency;
    // let logo = null;
    // console.log(' amount', amount, 'curency', currency);
    // console.log('curency', currency)
    let fixed = 2
    if (amount * swap < 0.01) {
      fixed = 5
    }



    return (
      <div style={main}>
        <div style={style}>
          <span > {(amount * swapEur).toFixed(fixed)} </span >
          <IconeEur></IconeEur>
        </div>
        <div style={style}>
          <span > {(amount * swap).toFixed(fixed)} </span >
          <IconeUsd></IconeUsd>
        </div>
      </div>
    )


  } else {
    return (
      < React.Fragment >
        <Loader />
      </React.Fragment>
    )
  }

};

export default nativeAmountFormater;