
import React from "react";

import Icon from '@mui/material/Icon';


export default function Loader(props) {

  return (
    <div className="container-spinner" >
      <div
        className='update-btn'
        id='wallet-spinner'
      >
        <Icon>sync</Icon>

      </div>
    </div >

  )



}

