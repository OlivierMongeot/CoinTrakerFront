// get last transaction for each token

const getLastestTransactionsCoinbase = (savedTrxs) => {

  let currentTokensWithTransaction = [];

  savedTrxs.forEach((transaction, index) => {

    if (transaction.exchange === 'coinbase') {
      // let resource = transaction.resource_path;
      let resourceArray = transaction.resource_path.split('/');
      let idAccount = resourceArray[3]
      if (!currentTokensWithTransaction.includes(idAccount)) {
        currentTokensWithTransaction.push(idAccount)
      }
    }
  })

  currentTokensWithTransaction.forEach((id, index) => {

    let transactionsByToken = savedTrxs.filter(transaction => {
      // const path = transaction.resource_path;
      const pathArray = transaction.resource_path.split('/');
      let idAcc = pathArray[3]
      return idAcc === id;
    })

    const lastTransaction = transactionsByToken.reduce((r, o) => new Date(o.created_at) > new Date(r.created_at) ? o : r);
    const token = lastTransaction.amount.currency;
    const path = lastTransaction.resource_path;
    const pathArray = path.split('/');
    currentTokensWithTransaction[index] = { id_account: pathArray[3], id_last_trx: pathArray[5], token: token }
  })
  return currentTokensWithTransaction;
}


export default getLastestTransactionsCoinbase;
