


const minValueDollarToDisplayToken = (exchangeName) => {
  if (exchangeName === 'all') {
    return 0.1;
  } else {
    return 0.0001;
  }
}


export default minValueDollarToDisplayToken;