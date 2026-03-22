import { combineReducers } from "redux";

import layoutReducer from "./layouts/reducer";

const rootReducer = combineReducers({
  Layout: layoutReducer,
});

export default rootReducer;
