export const SET_THEME = "SET_THEME"

export const setTheme = (mode) => {
  return (dispatch) => {
    return dispatch({ type: SET_THEME, payload: mode })
  }
}