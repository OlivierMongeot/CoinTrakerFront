
const rebuildDepositKucoin = async (deposits) => {
  console.log('rebuild Deposit kucoin', deposits)

  let index = 0;
  while (index < deposits.length) {

    deposits[index].exchange = 'kucoin'
    deposits[index].id = deposits[index].walletTxId;
    deposits[index].created_at = deposits[index].createdAt;
    deposits[index].native_amount = { amount: deposits[index].amount, currency: deposits[index].currency };
    deposits[index].transaction = 'deposit';
    deposits[index].info = {
      address: deposits[index]?.address,
      blockchain: deposits[index]?.chain,
      memo: deposits[index]?.memo,
      idTx: deposits[index]?.walletTxId,
      remark: deposits[index]?.remark,
      type: 'deposits',
      fee: deposits[index]?.fee,
      status: deposits[index]?.status
    }
    deposits[index].entry = {
      amount: deposits[index].amount,
      currency: deposits[index].currency,
      urlLogo: deposits[index].urlLogo
    }
    deposits[index].exit = {
      amount: 0,
      currency: ''
    }
    delete deposits[index].arrears
    delete deposits[index].updatedAt
    delete deposits[index].isInner
    delete deposits[index].walletTxId;
    delete deposits[index]?.remark;
    delete deposits[index].createdAt;
    delete deposits[index].chain;
    delete deposits[index].fee;
    delete deposits[index]?.memo;
    delete deposits[index].status;
    delete deposits[index].urlLogo;
    delete deposits[index].address;
    delete deposits[index].amount
    index++
  }
  console.log(deposits)
  return deposits;
}

export default rebuildDepositKucoin