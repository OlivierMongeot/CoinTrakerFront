import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';


const Formater = (props) => {

  // console.log(props.value)
  if (props.value) {

    return (
      <Tooltip title={props.value?.info}>
        <span style={{ fontSize: '0.9rem' }}>
          {props.value?.type}
        </span >
      </Tooltip>
    )
  }
};

export default Formater;