import { combineReducers } from "redux";

import layoutReducer from "./layouts/reducer";
import authReducer from "./auth/reducer";
import postsReducer from "./posts/reducer";

const rootReducer = combineReducers({
  Layout: layoutReducer,
  Auth: authReducer,
  Posts: postsReducer,
});

export default rootReducer;
