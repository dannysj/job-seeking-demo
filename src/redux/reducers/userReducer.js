initState = {
  user: {},
};

export default function reducer(state = initState, action) {

  switch (action.type) {
    case "UPDATE_USER_INFO": {
      return {
        ...state, user: {
          ...state.user,
          [action.payload.key]: action.payload.value
        }
      }
    }
  }

  return state
}