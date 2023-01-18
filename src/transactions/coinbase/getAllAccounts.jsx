import config from "../../config";

const getAllAccountCoinbase = async (userData, checkIfNewAccount = false) => {

  let nexPageAccounUri = null;

  async function fetchAccount(path) {

    const data = {
      email: userData.email,
      exchange: 'coinbase',
      path: path
    };

    const response = await fetch('http://' + config.urlServer + '/coinbase/accounts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': userData.token
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const accountsPage = await response.json();
    console.log('Get new Account : ', accountsPage.data.length);
    // console.log('Account Page', accountsPage.pagination);
    nexPageAccounUri = accountsPage.pagination.next_uri;
    return accountsPage;

  }

  const accountSaved = JSON.parse(localStorage.getItem('accounts-coinbase'));

  if (accountSaved && accountSaved.length > 0 && checkIfNewAccount === false) {
    return accountSaved
  } else {

    nexPageAccounUri = null;
    let accounts = [];

    try {
      const data = await fetchAccount('/v2/accounts');
      accounts = accounts.concat(data.data);
    } catch (error) {
      console.log('error catched :', error);
    }

    while (nexPageAccounUri !== null) {
      const dataNextPage = await fetchAccount(nexPageAccounUri);
      accounts = accounts.concat(dataNextPage.data);
    }
    // Lenght of allAccounts
    console.log('Nbr de tokens', accounts.length);

    localStorage.setItem('accounts-coinbase', JSON.stringify(accounts));
    return accounts;
  }

}


export default getAllAccountCoinbase