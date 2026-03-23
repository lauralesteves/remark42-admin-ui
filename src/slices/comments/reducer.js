import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getCommentsByPost as getCommentsByPostApi,
  deleteComment as deleteCommentApi,
  pinComment as pinCommentApi,
} from "../../helpers/backend_helper";
import { api } from "../../config";

export const getComments = createAsyncThunk(
  "comments/getComments",
  async ({ postUrl, sort = "-time" }) => {
    const response = await getCommentsByPostApi(api.SITE_ID, postUrl, sort);
    return response;
  }
);

export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async ({ id, postUrl }) => {
    await deleteCommentApi(api.SITE_ID, id, postUrl);
    toast.success("Comment deleted", { autoClose: 2000 });
    return id;
  }
);

export const togglePin = createAsyncThunk(
  "comments/togglePin",
  async ({ id, postUrl, pin }) => {
    await pinCommentApi(api.SITE_ID, id, postUrl, pin);
    toast.success(pin ? "Comment pinned" : "Comment unpinned", { autoClose: 2000 });
    return { id, pin };
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.comments = action.payload.comments || [];
      state.loading = false;
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    builder.addCase(removeComment.fulfilled, (state, action) => {
      state.comments = state.comments.map((c) =>
        c.id === action.payload ? { ...c, delete: true } : c
      );
    });

    builder.addCase(togglePin.fulfilled, (state, action) => {
      const { id, pin } = action.payload;
      state.comments = state.comments.map((c) =>
        c.id === id ? { ...c, pin } : c
      );
    });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
