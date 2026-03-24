import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

// Config
export const getConfig = (site) =>
  api.get(url.GET_CONFIG, { site });

// Auth
export const getCurrentUser = (site) =>
  api.get(url.GET_CURRENT_USER, { site });

// Comments
export const getCommentsByPost = (site, postUrl, sort = "-time", format = "plain") =>
  api.get(url.GET_COMMENTS_BY_POST, { site, url: postUrl, sort, format });

export const getLastComments = (site, limit, since) => {
  const params = { site };
  if (since) params.since = since;
  return api.get(`${url.GET_LAST_COMMENTS}/${limit}`, params);
};

export const getUserComments = (site, userId, limit = 20, skip = 0) =>
  api.get(url.GET_USER_COMMENTS, { site, user: userId, limit, skip });

export const getComment = (site, id) =>
  api.get(`${url.GET_COMMENT}/${id}`, { site });

export const getCommentCount = (site, postUrl) =>
  api.get(url.GET_COMMENT_COUNT, { site, url: postUrl });

export const createComment = (site, postUrl, text, parentId) => {
  const body = {
    text,
    locator: { site, url: postUrl },
  };
  if (parentId) body.pid = parentId;
  return api.create(url.POST_COMMENT, body);
};

export const previewComment = (site, postUrl, text) =>
  api.create(url.POST_PREVIEW, {
    text,
    locator: { site, url: postUrl },
  });

export const getCommentCounts = (site, urls) =>
  api.create(`${url.POST_COMMENT_COUNTS}?site=${encodeURIComponent(site)}`, urls);

// Posts
export const getPostsList = (site, limit = 50, skip = 0) =>
  api.get(url.GET_POSTS_LIST, { site, limit, skip });

export const getPostInfo = (site, postUrl) =>
  api.get(url.GET_POST_INFO, { site, url: postUrl });

// Admin — Comments
export const deleteComment = (site, id, postUrl) =>
  api.delete(`${url.DELETE_COMMENT}/${id}?site=${encodeURIComponent(site)}&url=${encodeURIComponent(postUrl)}`);

export const pinComment = (site, id, postUrl, pin) =>
  api.put(`${url.PUT_PIN_COMMENT}/${id}?site=${encodeURIComponent(site)}&url=${encodeURIComponent(postUrl)}&pin=${pin ? 1 : 0}`);

// Admin — Posts
export const setReadOnly = (site, postUrl, ro) =>
  api.put(`${url.PUT_READONLY}?site=${encodeURIComponent(site)}&url=${encodeURIComponent(postUrl)}&ro=${ro ? 1 : 0}`);

// Admin — Users
export const getUserInfo = (site, userId) =>
  api.get(`${url.GET_ADMIN_USER}/${userId}`, { site });

export const blockUser = (site, userId, block, ttl) => {
  let endpoint = `${url.GET_ADMIN_USER}/${userId}?site=${encodeURIComponent(site)}&block=${block ? 1 : 0}`;
  if (ttl) endpoint += `&ttl=${encodeURIComponent(ttl)}`;
  return api.put(endpoint);
};

export const deleteUser = (site, userId) =>
  api.delete(`${url.GET_ADMIN_USER}/${userId}?site=${encodeURIComponent(site)}`);

export const getBlockedUsers = (site) =>
  api.get(url.GET_BLOCKED_USERS, { site });

export const verifyUser = (site, userId, verified) =>
  api.put(`${url.PUT_VERIFY_USER}/${userId}?site=${encodeURIComponent(site)}&verified=${verified ? 1 : 0}`);

// Admin — Data
export const exportData = (site) =>
  api.get(url.GET_EXPORT, { site, mode: "file" });

export const importData = (site, provider, formData) => {
  const endpoint = `${url.POST_IMPORT}?site=${encodeURIComponent(site)}&provider=${encodeURIComponent(provider)}`;
  return api.create(endpoint, formData);
};

export const waitForOperation = (site, timeout = "15m") =>
  api.get(url.GET_WAIT, { site, timeout });
