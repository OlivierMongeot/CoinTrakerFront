import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const Formater = (props) => {


  // console.log(props)
  if (props.value) {

    return (
      <Tooltip title={props.value}>
        <InfoIcon>
        </InfoIcon>
      </Tooltip>
    )
  }
};

export default Formater;