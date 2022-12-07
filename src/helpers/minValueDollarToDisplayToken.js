


const minValueDollarToDisplayToken = (exchangeName) => {
  if (exchangeName === 'all') {
    return 0.1;
  } else {
    return 0.001;
  }
}


export default minValueDollarToDisplayToken;