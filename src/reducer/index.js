import { combineReducers } from "redux";
import themeReducer from "./theme.reducer";
import transactionsReducer from "./transactions.reducer";

export default combineReducers({
  themeReducer,
  transactionsReducer
})