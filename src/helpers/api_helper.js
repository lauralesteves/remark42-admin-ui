import axios from "axios";
import { api } from "../config";

// Empty baseURL = relative paths. In dev, CRA proxy forwards to Remark42.
// In production, the admin UI and API share the same domain.
axios.defaults.baseURL = "";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Remark42 requires the XSRF-TOKEN cookie value sent as X-XSRF-TOKEN header
axios.interceptors.request.use(function (config) {
  const xsrf = document.cookie
    .split("; ")
    .find((c) => c.startsWith("XSRF-TOKEN="));
  if (xsrf) {
    config.headers["X-XSRF-TOKEN"] = xsrf.split("=")[1];
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    const status = error.response?.status;

    if (status === 401) {
      return Promise.reject({ status: 401, message: "Unauthorized" });
    }

    let message;
    switch (status) {
      case 403:
        message = "Access denied";
        break;
      case 404:
        message = "Not found";
        break;
      case 500:
        message = "Internal server error";
        break;
      default:
        message = error.response?.data?.error || error.message || error;
    }
    return Promise.reject({ status, message });
  }
);

class APIClient {
  get = (url, params) => {
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
        .join("&");
      return axios.get(`${url}?${queryString}`);
    }
    return axios.get(url);
  };

  create = (url, data) => {
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

export { APIClient };
