const DataService = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return state.user = action.data;
    default:
      return state;
  }
}
 
export default DataService;
