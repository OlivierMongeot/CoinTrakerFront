const getSimpleDate = (datetime) => {

  const dateFormated = new Date(datetime);
  // console.log('get Date ', datetime, dateFormated)
  return dateFormated.getDate().toString().padStart(2, "0")
    + '-' + (parseFloat(dateFormated.getMonth()) + 1).toString().padStart(2, "0")
    + '-' + dateFormated.getFullYear();

}

export default getSimpleDate;