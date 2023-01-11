import { SET_TRANSACTIONS_STATE } from '../action/transactions.action'

const initialState = {}

export default function transactionsReducer(state = initialState, action) {

  switch (action.type) {
    case SET_TRANSACTIONS_STATE:
      return action.payload

    default:
      return state;
  }

} 