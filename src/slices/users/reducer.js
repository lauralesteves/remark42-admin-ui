import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getBlockedUsers as getBlockedUsersApi,
  blockUser as blockUserApi,
} from "../../helpers/backend_helper";
import { api } from "../../config";

export const fetchBlockedUsers = createAsyncThunk(
  "users/fetchBlockedUsers",
  async () => {
    const response = await getBlockedUsersApi(api.SITE_ID);
    return response;
  }
);

export const unblockUser = createAsyncThunk(
  "users/unblockUser",
  async (userId) => {
    await blockUserApi(api.SITE_ID, userId, false);
    toast.success("User unblocked", { autoClose: 2000 });
    return userId;
  }
);

const initialState = {
  blockedUsers: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBlockedUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBlockedUsers.fulfilled, (state, action) => {
      state.blockedUsers = action.payload || [];
      state.loading = false;
    });
    builder.addCase(fetchBlockedUsers.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    builder.addCase(unblockUser.fulfilled, (state, action) => {
      state.blockedUsers = state.blockedUsers.filter(
        (u) => u.id !== action.payload
      );
    });
  },
});

export default usersSlice.reducer;
