# Remark42 Admin UI

A standalone admin panel for [Remark42](https://remark42.com/) — a self-hosted, privacy-focused comment engine. Built with React, Bootstrap, and the Remark42 REST API.

Manage comments, moderate users, and monitor activity from a clean, responsive dashboard — no iframes, no embedded widgets.

## Features

- **Dashboard** — overview stats, recent comments, top posts
- **Posts** — list all posts with comment counts, toggle read-only
- **Comments** — browse recent comments across all posts, filter by time, auto-refresh
- **Post Comments** — view and manage comments for a specific post (delete, pin/unpin, sort)
- **Users** — blocked users list, user detail with comment history, block/unblock/verify
- **Demo** — native comment preview page, post and reply using the API
- **Settings** — view site configuration, export/import data
- **Responsive** — works on desktop and mobile
- **Dark mode** — dark theme by default, toggle in header

## Local Development

### Prerequisites

- [Node.js 20](https://nodejs.org/) (pin via `.nvmrc`)
- [Docker](https://www.docker.com/) (for running Remark42)

### 1. Start Remark42

```bash
cd /path/to/remark42
docker compose -f compose-dev-backend.yml build
docker compose -f compose-dev-backend.yml up
```

Remark42 runs at `http://127.0.0.1:8080` with:
- Dev OAuth provider on port 8084 (user `dev_user` is auto-admin)
- Admin basic auth: `admin` / `password`
- Site ID: `remark` (default)

### 2. Start the Admin UI

```bash
git clone https://github.com/lauralesteves/remark42-admin-ui.git
cd remark42-admin-ui
cp .env.example .env
npm install --legacy-peer-deps
make server
```

Open `http://127.0.0.1:3000` (not `localhost` — the dev OAuth cookie is bound to `127.0.0.1`).

### 3. Authenticate

1. Click **"Dev Login (local only)"**
2. Log in as any user on the dev OAuth page — `dev_user` is auto-admin
3. You'll land on the dashboard

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://127.0.0.1:8080` | Remark42 API URL (used for OAuth redirects) |
| `REACT_APP_SITE_ID` | `remark` | Remark42 site ID |

## Deployment

### Option 1: Docker Sidecar (Recommended)

Run the admin UI as a separate container alongside Remark42, with a reverse proxy routing traffic.

#### Architecture

```
comments.example.com
├── /admin/*  →  remark42-admin-ui (:80)
└── /*        →  remark42 (:8080)
```

#### 1. Build the image

```bash
docker build \
  --build-arg PUBLIC_URL=/admin \
  --build-arg REACT_APP_SITE_ID=remark \
  -t ghcr.io/lauralesteves/remark42-admin-ui:latest .
```

Or pull the pre-built image:

```bash
docker pull ghcr.io/lauralesteves/remark42-admin-ui:latest
```

#### 2. Add to docker-compose

```yaml
services:
  remark42:
    image: ghcr.io/umputun/remark42:latest
    # ... your existing remark42 config ...

  remark42-admin:
    image: ghcr.io/lauralesteves/remark42-admin-ui:latest
    container_name: remark42-admin
    restart: always
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```

#### 3. Configure the reverse proxy

**Caddy:**

```caddyfile
comments.example.com {
    handle /admin/* {
        uri strip_prefix /admin
        reverse_proxy remark42-admin:80
    }
    handle {
        reverse_proxy remark42:8080
    }
}
```

**Nginx:**

```nginx
server {
    server_name comments.example.com;

    location /admin/ {
        rewrite ^/admin/(.*) /$1 break;
        proxy_pass http://remark42-admin:80;
    }

    location / {
        proxy_pass http://remark42:8080;
    }
}
```

#### 4. Access

Navigate to `https://comments.example.com/admin/` and sign in with your configured OAuth provider (Google, GitHub, etc.). You must be an admin user in Remark42.

### Option 2: Go Embed (Future)

The admin UI can be embedded directly into the Remark42 Go binary — the same way Remark42 embeds its own frontend with `//go:embed web`. This eliminates the need for a separate container entirely.

This requires changes to the Remark42 source:

1. Add a build stage in the Remark42 `Dockerfile`:

```dockerfile
FROM node:20-alpine AS build-admin-ui
WORKDIR /app
COPY ./remark42-admin-ui/package*.json ./
RUN npm ci --legacy-peer-deps
COPY ./remark42-admin-ui/ .
ARG REACT_APP_SITE_ID=remark
ENV PUBLIC_URL=/admin
RUN npm run build
```

2. Copy build output before Go compilation:

```dockerfile
COPY --from=build-admin-ui /app/build/ /build/backend/app/cmd/admin/
```

3. Add embed directive in `backend/app/cmd/server.go`:

```go
//go:embed admin
var adminFS embed.FS
```

4. Register the file server route in `backend/app/rest/api/rest.go` (same pattern as the existing `addFileServer` for `/web/*`):

```go
addFileServer(r, s.AdminFS, s.AdminRoot, "/admin", s.Version)
```

This approach means the admin UI ships inside the `remark42` binary — single container, zero extra infrastructure.

## Tech Stack

- React 19 + React Router 6
- Redux Toolkit (state management)
- Reactstrap + Bootstrap 5 (UI framework)
- Axios (HTTP, cookie-based auth)
- Formik + Yup (forms)
- Moment.js (dates)
- SCSS theming

## License

MIT
