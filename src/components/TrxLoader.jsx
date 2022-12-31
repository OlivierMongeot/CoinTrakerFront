import React from "react";
import Icon from '@mui/material/Icon';

export default function Loader(props) {


  const style = {
    width: '40px',
    display: props.display
  }

  return (
    <div className="container-spinner" style={style}>

      <div className='update-btn' >
        <Icon>sync</Icon>
      </div>
    </div >
  )
}

