
import React from "react";

import Icon from '@mui/material/Icon';


export default function Loader(props) {

  return (
    <div id="container-spinner" >
      <div
        className='update-btn hide'
        id='wallet-spinner'
      >
        <Icon sx={{ fontSize: 80 }} >sync</Icon>

      </div>
    </div >

  )



}

