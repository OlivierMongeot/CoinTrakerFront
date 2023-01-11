import * as React from 'react';

const Info = (props) => {


  // console.log(props)
  if (props.value) {
    // console.log(props.value)
    const data = props.value
    if (data.hasOwnProperty('blockchain') && data.blockchain !== null) {
      return (
        <div>
          Chain : {data.blockchain.toUpperCase()}
        </div>
      )
    }
  } else {
    return (
      <div>
        ...
      </div>
    )
  }
};

export default Info;