import { SET_THEME } from '../action/theme.action'

const initialState = {}

export default function themeReducer(state = initialState, action) {

  switch (action.type) {
    case SET_THEME:
      return action.payload

    default:
      return state;
  }


} 