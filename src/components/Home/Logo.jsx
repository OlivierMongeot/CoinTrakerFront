import * as React from 'react';

const Logo = (props) => {

  const style = {
    width: '20px',
    height: '20px'
  }

  return (
    <React.Fragment>
      <img
        style={style}
        src={props.url}
        alt="Token" />
    </React.Fragment>
  )
};

export default Logo;