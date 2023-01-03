import axios from "axios";

const getQuoteHistorics = async (pairs, dateTime) => {


  const url = 'http://cmc/historic-quote?symbol=';
  const response = await axios.get(url);



  return { pairs, response }
}

export default getQuoteHistorics