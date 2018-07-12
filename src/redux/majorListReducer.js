const initState = [];


export default (state = initState, action) => {
  switch (action.type) {
    case "FETCH_MAJOR_LIST_FULFILLED":
      const list = action.payload.data.list;
      list.forEach(e=> e.value = e.text);
      return list;


    default:
      return state;
  }
}