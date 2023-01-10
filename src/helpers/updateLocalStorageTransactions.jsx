


const updateLocalStorageTransaction = (transaction) => {

  console.log('update LOCAL STORAGE  trade', transaction.exchange)
  let transactions = JSON.parse(localStorage.getItem('transactions-all'))
  transactions.forEach((element, index) => {
    if (element.id === transaction.id) {
      transactions[index].quote_transaction = transaction.quote_transaction
    }
  });
  localStorage.setItem('transactions-all', JSON.stringify(transactions))
}


export default updateLocalStorageTransaction