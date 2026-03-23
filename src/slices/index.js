import { combineReducers } from "redux";

import layoutReducer from "./layouts/reducer";
import authReducer from "./auth/reducer";
import postsReducer from "./posts/reducer";
import commentsReducer from "./comments/reducer";

const rootReducer = combineReducers({
  Layout: layoutReducer,
  Auth: authReducer,
  Posts: postsReducer,
  Comments: commentsReducer,
});

export default rootReducer;
