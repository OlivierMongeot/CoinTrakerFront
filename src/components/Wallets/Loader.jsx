import React from "react";
import Icon from '@mui/material/Icon';

export default function Loader(props) {

  let id = 'wallet-spinner-' + props.exchange

  return (
    <div className="container-spinner" >
      <div className='update-btn hide' id={id}>
        <Icon sx={{ fontSize: props.fontSize }} >sync</Icon>
      </div>
    </div >
  )
}

