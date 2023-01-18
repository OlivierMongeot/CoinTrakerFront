

const rebuildWithdrawsKucoin = async (withdrawals) => {
  console.log('rebuild Withdraw kucoin')

  let index = 0;
  while (index < withdrawals.length) {
    // withdrawals[index].title = 'Address withdrawals : ' + withdrawals[index].address; // For datagrid
    withdrawals[index].exchange = 'kucoin' // For datagrid
    withdrawals[index].id = withdrawals[index].walletTxId; // For datagrid
    // withdrawals[index].smartType = 'Blockchain : ' + withdrawals[index].chain.toUpperCase();
    withdrawals[index].created_at = withdrawals[index].createdAt // For datagrid
    withdrawals[index].info = {
      address: withdrawals[index].address,
      blockchain: withdrawals[index].chain,
      memo: withdrawals[index]?.memo,
      idTx: withdrawals[index]?.walletTxId,
      fee: withdrawals[index].fee,
      remark: withdrawals[index].remark,
      type: 'withdrawals',
      status: withdrawals[index].status
    }

    withdrawals[index].exit = {
      amount: withdrawals[index].amount,
      currency: withdrawals[index].currency,
      urlLogo: withdrawals[index].urlLogo
    }
    withdrawals[index].entry = {
      amount: 0,
      currency: ''
    }

    withdrawals[index].native_amount = { amount: withdrawals[index].amount, currency: withdrawals[index].currency };
    withdrawals[index].transaction = 'withdrawals'

    delete withdrawals[index].isInner
    delete withdrawals[index].updatedAt
    delete withdrawals[index].updated_at
    delete withdrawals[index].walletTxId
    delete withdrawals[index].createdAt;
    delete withdrawals[index].chain;
    delete withdrawals[index].fee;
    delete withdrawals[index].memo;
    delete withdrawals[index]?.remark;
    delete withdrawals[index].status;
    delete withdrawals[index].urlLogo
    delete withdrawals[index].amount

    index++;
  }
  return withdrawals;
}

export default rebuildWithdrawsKucoin