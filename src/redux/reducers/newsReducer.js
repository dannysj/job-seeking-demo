export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_NEWS_FULFILLED":
      return {...state, [action.payload.key]: action.payload.value};
    default:
      return state;
  }
}