import React from "react";
import Icon from '@mui/material/Icon';

export default function Loader(props) {
  let display = 'none';
  if (props.display === true) {
    display = 'block'
  }

  const style = {
    width: '40px',
    display: display
  }

  return (
    <div className="container-spinner" style={style}>

      <div className='update-btn' >
        <Icon>sync</Icon>
      </div>
    </div >
  )
}

