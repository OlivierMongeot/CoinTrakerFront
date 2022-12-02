
const shouldIUpdateFromAPI = (exchangeName) => {

  const timer = 360000;

  if ('wallet-' + exchangeName in localStorage && (typeof (localStorage.getItem('wallet-' + exchangeName)) === 'string')) {

    let walletLocalStorage = JSON.parse(localStorage.getItem('wallet-' + exchangeName));
    if (!walletLocalStorage) {
      console.log('Wallet vide Trouvé en local Store');
      return false;
    }
    console.log('Wallet  ' + exchangeName + ' in LocalStorage for');

    if (walletLocalStorage.length > 0) {

      let difference = new Date().getTime() - walletLocalStorage[0].timestamp // timestamp
      if (difference > timer) {

        console.log('Time > 6 min , Update Wallet from API');
        return true;
      } else {
        console.log('Recent Time update, Display Wallet ' + exchangeName + ' from Local Store');
        return false;
      }
    } else {
      console.log('Data: wallet-' + exchangeName + ' est un tableau vide');
      return true;
    }
  } else {
    console.log('Data: wallet-' + exchangeName + ' n\'existe pas');
    return true;
  }


}

export default shouldIUpdateFromAPI;