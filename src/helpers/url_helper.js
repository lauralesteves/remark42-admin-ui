// Config
export const GET_CONFIG = "/api/v1/config";

// Auth
export const GET_CURRENT_USER = "/api/v1/user";

// Comments
export const GET_COMMENTS_BY_POST = "/api/v1/find";
export const GET_LAST_COMMENTS = "/api/v1/last";
export const GET_USER_COMMENTS = "/api/v1/comments";
export const GET_COMMENT = "/api/v1/id";
export const GET_COMMENT_COUNT = "/api/v1/count";
export const POST_COMMENT_COUNTS = "/api/v1/counts";

// Posts
export const GET_POSTS_LIST = "/api/v1/list";
export const GET_POST_INFO = "/api/v1/info";

// Admin — Comments
export const DELETE_COMMENT = "/api/v1/admin/comment";
export const PUT_PIN_COMMENT = "/api/v1/admin/pin";

// Admin — Posts
export const PUT_READONLY = "/api/v1/admin/readonly";

// Admin — Users
export const GET_ADMIN_USER = "/api/v1/admin/user";
export const GET_BLOCKED_USERS = "/api/v1/admin/blocked";
export const PUT_VERIFY_USER = "/api/v1/admin/verify";

// Admin — Data
export const GET_EXPORT = "/api/v1/admin/export";
export const POST_IMPORT = "/api/v1/admin/import/form";
export const GET_WAIT = "/api/v1/admin/wait";
