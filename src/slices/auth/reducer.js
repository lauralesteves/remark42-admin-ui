import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: null,
  loading: true,
  error: null,
  isAdmin: false,
  isUserLogout: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authPending(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload.admin === true;
      state.loading = false;
      state.error = null;
      state.isUserLogout = false;
    },
    authError(state, action) {
      state.user = null;
      state.isAdmin = false;
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isAdmin = false;
      state.loading = false;
      state.isUserLogout = true;
    },
  },
});

export const { authPending, authSuccess, authError, logoutSuccess } =
  authSlice.actions;

export default authSlice.reducer;
