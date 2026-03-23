import { combineReducers } from "redux";

import layoutReducer from "./layouts/reducer";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
  Layout: layoutReducer,
  Auth: authReducer,
});

export default rootReducer;
