import Map from "immutable";
import store from ".";

// How to rework the redux?
// Currently problem: 1: the usage of redux is relatively small. It doesn't cover a lot of actions, making it hard to track all of the action.
//           problem 2: there does have some side effect in reducer, leaving redux vulunrable in execution 
//

// So the plan of the attack this time is to elimnate the side effect and asychronous action call 
// Add more action and reducers to allow for more functionality.

// working on login for now. 
//

export const userStatus = Map({
  logout: -1,
  pending: 0,
  login: 1,
})

export const loginStatus = {
    DEFAULT: 0,
    LOGIN_SUCCESS: 1,
    LOGIN_FAILURE: 2
}


// init user state
const initUser = Map({
  balance: "0.00",
  cover: "",
  dob: null, // not used
  email: "",
  first: "",
  last: "",
  id: -1,
  isactivated: false,
  isadmin: false,
  ismentor: false,
  major: [],
  num_notifications: 0,
  profile_pic: "/img/sample_profile.jpg",
  register_date: null, // not used
  resume: "",
  wechat: "",
  status: userStatus.logout
  }
)

function user(state = initUser, action){
    switch (action.type){

        case "SET_USER":
            // I don't know what is local storage
            // I figure out
            localStorage.setItem('uid', action.payload.id);
            return {...action.payload, status: userStatus.login};
        
        case "LOGOUT":
            localStorage.removeItem('uid');
            return {...initState};

        default: 
            return state
    }
}


function login (state = loginStatus.DEFAULT, action){

    switch (action.type){
        case "LOGIN_FAILURE":
            return loginStatus.LOGIN_FAILURE
        case "LOGIN_SUCCESS":
            return loginStatus.LOGIN_SUCCESS
        case "LOGIN_DEFAULT":
            return loginStatus.DEFAULT
 
        default:
            return state
    }
}

export default {user, login};


