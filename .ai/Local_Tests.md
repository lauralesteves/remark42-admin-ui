# Local Development Environment

## 1. Run Remark42 locally

```bash
cd ~/workspace/lauralesteves/remark42
make rundev
```

This spins up Remark42 at `http://127.0.0.1:8080` with:
- **Admin basic auth:** username `dev`, password `password`
- **Dev OAuth provider** on port 8084 (user `dev_user` is auto-admin)
- **CORS enabled** — allows cross-origin requests from your React dev server
- **Site ID:** `remark` (default)
- Anonymous access enabled

## 2. Run the Admin UI

```bash
cd ~/workspace/lauralesteves/remark42-admin-ui
# .env
REACT_APP_API_URL=http://127.0.0.1:8080
REACT_APP_SITE_ID=remark

npm start
```

React dev server runs on `localhost:3000`, hits the Remark42 API at `127.0.0.1:8080`. CORS is already configured to allow all origins in dev mode.

## Auth during local dev

Two options:

- **Dev OAuth** — click login, get redirected to the dev auth provider on port 8084, login as `dev_user` (auto-admin). Cookie-based, works seamlessly.
- **Basic auth** — `curl -u dev:password http://127.0.0.1:8080/api/v1/admin/...` for quick API testing.

## Important

Use `127.0.0.1` (not `localhost`) — the dev OAuth provider is bound to that specific IP.
