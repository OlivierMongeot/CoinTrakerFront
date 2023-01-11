export const SET_TRANSACTIONS_STATE = "SET_TRANSACTIONS_STATE"

export const setTransactionsState = (mode) => {
  return (dispatch) => {
    return dispatch({ type: SET_TRANSACTIONS_STATE, payload: mode })
  }
}