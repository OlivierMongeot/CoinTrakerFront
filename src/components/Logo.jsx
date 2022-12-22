import * as React from 'react';

const Logo = (props) => {


  return (
    <React.Fragment>
      <img
        className="logo-market"
        src={props.url}
        alt="Token" />
    </React.Fragment>
  )
};

export default Logo;