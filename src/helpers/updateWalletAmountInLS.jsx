const updateWalletAmountInLS = (parentData, exchange, total) => {

  let exchangeInArray = false;
  for (let i = 0; i < parentData.length; i++) {
    if (parentData[i].exchange === exchange) {
      parentData[i].amount = total;
      exchangeInArray = true;
    }
  }
  if (exchangeInArray === false) {
    parentData.push({ exchange: exchange, amount: total });
  }
  // if (exchange !== 'all') {
  localStorage.setItem('wallets-amount', JSON.stringify(parentData));
  // }
}

export default updateWalletAmountInLS;
