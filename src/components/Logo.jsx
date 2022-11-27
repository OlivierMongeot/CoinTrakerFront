import * as React from 'react';

const Logo = (props) => {


  return (
    <React.Fragment>
      <img
        className="logo-market"
        src={props.url}
        alt="toto" />
    </React.Fragment>
  )
};

export default Logo;