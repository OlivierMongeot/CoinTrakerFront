
const setAndSaveTotalAllWallets = (parentData, props) => {
  let acc = 0;
  for (let i = 0; i < parentData.length; i++) {
    let value = parentData[i].amount;
    if (parentData[i].exchange !== 'all') {
      acc += value;
    }
  }
  // console.log('setTotalAllWallet', acc)
  localStorage.setItem('wallets-total', JSON.stringify(acc));
  props.setTotalAllWallet(acc);
}


export default setAndSaveTotalAllWallets;