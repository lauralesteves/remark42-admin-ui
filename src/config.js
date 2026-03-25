const api = {
  API_URL: process.env.REACT_APP_API_URL || "",
  SITE_ID: process.env.REACT_APP_SITE_ID || "",
};

async function initConfig() {
  try {
    const baseUrl = api.API_URL || "";
    const res = await fetch(`${baseUrl}/api/v1/config`);
    const config = await res.json();
    if (config.sites && config.sites.length > 0) {
      api.SITE_ID = config.sites[0];
    }
  } catch (e) {
    console.warn("Failed to fetch site config:", e);
  }
  if (!api.SITE_ID) {
    api.SITE_ID = "remark";
  }
}

module.exports = { api, initConfig };
