import * as React from 'react';

const DateFormater = (props) => {
  // console.log('props', props);
  if (props.value) {
    // 2022-08-03T08:53:58Z
    const value = props.value;

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const dateOnj = new Date(value);
    return dateOnj.toLocaleDateString("fr-FR", options);


    // let dateArray = (value).split('T')
    // let date = dateArray[0];
    // let time = dateArray[1];
    // return (
    //   <span > {date + ' à ' + time.slice(0, -4)} </span >
    // )
  }
};

export default DateFormater;