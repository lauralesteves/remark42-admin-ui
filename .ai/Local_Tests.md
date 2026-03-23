# Local Development Environment

## 1. Run Remark42 locally

```bash
cd ~/workspace/lauralesteves/remark42
docker compose -f compose-dev-backend.yml build
docker compose -f compose-dev-backend.yml up
```

First build takes a while (compiles Go + frontend). Subsequent starts are fast.

Remark42 will be running at `http://127.0.0.1:8080` with:
- **Admin basic auth:** username `dev`, password `password`
- **Dev OAuth provider** on port 8084 (user `dev_user` is auto-admin)
- **CORS enabled** — allows cross-origin requests from your React dev server
- **Site ID:** `remark` (default)
- Anonymous access enabled

## 2. Run the Admin UI

```bash
cd ~/workspace/lauralesteves/remark42-admin-ui
make server
```

The `.env` is already configured:
```
REACT_APP_API_URL=http://127.0.0.1:8080
REACT_APP_SITE_ID=remark
```

App opens at `http://localhost:3000`.

## 3. Authenticate

1. Open `http://localhost:3000` — you'll see the login page
2. Click **"Dev Login (local only)"** — redirects to dev OAuth provider on port 8084
3. Log in as any user (user `dev_user` is auto-granted admin)
4. After auth, Remark42 sets a cookie and redirects back to the dashboard

## Auth during local dev

- **Dev OAuth** — click "Dev Login" button on the login page, authenticate as `dev_user` (auto-admin)
- **Basic auth** — `curl -u dev:password http://127.0.0.1:8080/api/v1/admin/...` for quick API testing

## Important

- Use `127.0.0.1` (not `localhost`) for the API URL — the dev OAuth provider is bound to that IP
- Data is stored in `~/workspace/lauralesteves/remark42/var/` (mounted volume)
- To stop: `docker compose -f compose-dev-backend.yml down`
