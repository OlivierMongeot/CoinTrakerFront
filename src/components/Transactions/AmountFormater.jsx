import * as React from 'react';

const AmountFormater = (props) => {
  // console.log('props', props);
  if (props.value) {

    let value = (parseFloat((props.value)));
    if (value < 1 && value > -1) {
      value = value.toFixed(6)
    } else {
      value = value.toFixed(2)
    }

    return (
      <span style={{
        color: value > 0 ? "green" : "red"
      }}> {value} </span >
    )
  }
};

export default AmountFormater;