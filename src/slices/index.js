import { combineReducers } from "redux";

import layoutReducer from "./layouts/reducer";
import authReducer from "./auth/reducer";
import postsReducer from "./posts/reducer";
import commentsReducer from "./comments/reducer";
import usersReducer from "./users/reducer";

const rootReducer = combineReducers({
  Layout: layoutReducer,
  Auth: authReducer,
  Posts: postsReducer,
  Comments: commentsReducer,
  Users: usersReducer,
});

export default rootReducer;
