export default (state = {}, action) => {
  switch (action.type) {
    case "FETCH_USER_FULFILLED":
      return action.payload.data.user;
    default:
      return state;
  }
}