import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getPostsList as getPostsListApi, setReadOnly as setReadOnlyApi } from "../../helpers/backend_helper";
import { api } from "../../config";

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async ({ limit = 50, skip = 0 } = {}) => {
    const response = await getPostsListApi(api.SITE_ID, limit, skip);
    return { posts: response, skip };
  }
);

export const toggleReadOnly = createAsyncThunk(
  "posts/toggleReadOnly",
  async ({ url, readOnly }) => {
    await setReadOnlyApi(api.SITE_ID, url, readOnly);
    toast.success(readOnly ? "Post locked" : "Post unlocked", { autoClose: 2000 });
    return { url, readOnly };
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload.posts || [];
      state.loading = false;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    builder.addCase(toggleReadOnly.fulfilled, (state, action) => {
      const { url, readOnly } = action.payload;
      state.posts = state.posts.map((post) =>
        post.url === url ? { ...post, read_only: readOnly } : post
      );
    });
  },
});

export default postsSlice.reducer;
