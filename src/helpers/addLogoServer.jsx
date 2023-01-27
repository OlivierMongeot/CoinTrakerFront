import config from "../config";

const addLogoServer = async (code, currency, userData) => {
  console.log('add logo server')
  const data = {
    code: code,
    currency: currency
  };

  const response = await fetch('http://' + config.urlServer + '/set-logo/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': userData.token
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  let res = await response.json();
  console.log('addlogo', res)
  return res
}


export default addLogoServer