import * as React from 'react';
import LogoUSD from '../images/usd.svg';

const nativeAmountFormater = (props) => {
  // console.log('props', props);
  if (props) {
    // 2022-08-03T08:53:58Z
    let amount = props.value > 0 ? props.value : - props.value;


    return (
      <React.Fragment>
        <span > {amount} </span >

        <img
          className="logo-transac"
          src={LogoUSD}
          alt="Token" />
      </React.Fragment>
    )


  }


};

export default nativeAmountFormater;