import * as React from 'react';

const TokenFormater = (props) => {
  // console.log('props', props);
  if (props.value) {

    const value = props.value;
    return (
      <span > {value} </span >
    )
  }
};

export default TokenFormater;