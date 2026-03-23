import { APIClient } from "../../helpers/api_helper";
import { api } from "../../config";
import { authPending, authSuccess, authError, logoutSuccess } from "./reducer";

const apiClient = new APIClient();

export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(authPending());
    const response = await apiClient.get("/api/v1/user", {
      site: api.SITE_ID,
    });
    dispatch(authSuccess(response));
  } catch (error) {
    dispatch(authError(error.message || "Authentication failed"));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await apiClient.get("/auth/logout");
  } catch (_) {
    // best-effort server logout
  }
  dispatch(logoutSuccess());
};
