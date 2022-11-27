import * as React from 'react';

const PourcentFormater = (props) => {
  if (props.value) {
    const value = (props.value).toFixed(2);
    return (
      <span style={{
        color: value > 0 ? "green" : "red"
      }}> {value} %</span >
    )
  }

};

export default PourcentFormater;