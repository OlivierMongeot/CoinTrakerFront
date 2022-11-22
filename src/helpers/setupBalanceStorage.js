
const setupBalanceStorage = (exchange, totalAccount) => {

    // Get walletBalance from localStorage
    let walletsBalances = localStorage.getItem('balances');
    if (walletsBalances === null) {
        walletsBalances = {};
    } else {
        walletsBalances = JSON.parse(walletsBalances);
    }
    // Add new balance to walletBalance
    walletsBalances[exchange] = totalAccount;
    localStorage.setItem('balances', JSON.stringify(walletsBalances));
}


export default setupBalanceStorage;