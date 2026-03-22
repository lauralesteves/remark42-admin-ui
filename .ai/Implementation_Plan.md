# Remark42 Admin UI — Implementation Plan

## Vision

A standalone admin panel for managing Remark42 comments — inspired by WordPress comment management but built as a modern, responsive React SPA. No iframes, no embedded widgets. A clean dashboard where admins can browse posts, manage comments (approve, delete, pin), moderate users (block, verify), and monitor activity — all from desktop or mobile.

**Domain:** `comments.escrevida.com/admin/*`
**Sites:** `escrevida`, `lauraesteves`
**Auth:** Google OAuth (shared cookies with Remark42 on same domain)
**Admin Avatar:** Use Google account profile picture from Remark42 user data (`user.picture`)

---

## Tech Stack

Based on the Velzon React template (same as cortex-frontend):

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + React Router 6 |
| State | Redux Toolkit (slices + thunks) |
| UI | Reactstrap + Bootstrap 5 (Velzon default theme) |
| Forms | Formik + Yup |
| HTTP | Axios (with interceptors) |
| Tables | TanStack React Table v8 |
| Icons | Remixicon |
| Notifications | React-Toastify |
| Styling | SCSS (Velzon themes) |
| Build | Create React App (react-scripts) |
| Deploy | Docker (Node build → Caddy alpine) |

---

## Architecture Overview

```
src/
├── App.js
├── index.js
├── config.js                    # API_URL, SITE_ID env vars
├── Routes/
│   ├── index.js                # Router with public/protected split
│   ├── allRoutes.js            # Route definitions
│   └── AuthProtected.js        # Auth guard (checks /api/v1/user)
├── Layouts/
│   ├── index.js                # Main layout (Header + Sidebar + Content)
│   ├── Header.js               # Top bar (site selector, user menu)
│   ├── Sidebar.js              # Navigation menu
│   ├── Footer.js
│   └── LayoutMenuData.js       # Menu items
├── pages/
│   ├── Authentication/
│   │   └── Login.js            # OAuth redirect to Remark42 auth
│   ├── Dashboard/
│   │   └── index.js            # Overview stats + recent comments
│   ├── Posts/
│   │   ├── PostsList.js        # All posts with comment counts
│   │   └── PostComments.js     # Comments for a specific post
│   ├── Comments/
│   │   ├── RecentComments.js   # Latest comments across all posts
│   │   └── UserComments.js     # Comments by a specific user
│   ├── Users/
│   │   ├── BlockedUsers.js     # Blocked users list
│   │   └── UserDetail.js       # User profile + actions
│   └── Settings/
│       └── SiteSettings.js     # Site config viewer
├── slices/
│   ├── index.js                # Root reducer
│   ├── layouts/                # Layout state
│   ├── auth/                   # Auth state
│   ├── comments/               # Comments CRUD
│   ├── posts/                  # Posts listing
│   ├── users/                  # Users management
│   └── dashboard/              # Dashboard stats
├── helpers/
│   ├── api_helper.js           # Axios client (cookie-based auth)
│   ├── backend_helper.js       # API endpoint wrappers
│   └── url_helper.js           # URL constants
├── Components/
│   └── Common/                 # BreadCrumb, DeleteModal, etc.
└── assets/                     # Velzon SCSS + images
```

---

## API Integration Map

### Authentication (cookie-based, no token management needed)
| Action | Method | Endpoint |
|--------|--------|----------|
| Check auth | GET | `/api/v1/user?site={site}` |
| Login | Redirect | `/auth/google/login?from=/admin` |
| Logout | GET | `/auth/logout` |
| Get config | GET | `/api/v1/config?site={site}` |

### Comments
| Action | Method | Endpoint |
|--------|--------|----------|
| List by post | GET | `/api/v1/find?site={site}&url={url}&format=plain&sort=-time` |
| Get single | GET | `/api/v1/id/{id}?site={site}` |
| Recent (all posts) | GET | `/api/v1/last/{limit}?site={site}` |
| User's comments | GET | `/api/v1/comments?site={site}&user={userId}&limit={n}&skip={n}` |
| Delete (admin) | DELETE | `/api/v1/admin/comment/{id}?site={site}&url={url}` |
| Pin/Unpin | PUT | `/api/v1/admin/pin/{id}?site={site}&url={url}&pin=[0\|1]` |
| Count | GET | `/api/v1/count?site={site}&url={url}` |
| Multiple counts | POST | `/api/v1/counts?site={site}` |

### Posts
| Action | Method | Endpoint |
|--------|--------|----------|
| List all posts | GET | `/api/v1/list?site={site}&limit={n}&skip={n}` |
| Post info | GET | `/api/v1/info?site={site}&url={url}` |
| Toggle read-only | PUT | `/api/v1/admin/readonly?site={site}&url={url}&ro=[0\|1]` |

### Users
| Action | Method | Endpoint |
|--------|--------|----------|
| Get user info | GET | `/api/v1/admin/user/{userId}?site={site}` |
| Block/Unblock | PUT | `/api/v1/admin/user/{userId}?site={site}&block=[0\|1]&ttl={duration}` |
| Delete user | DELETE | `/api/v1/admin/user/{userId}?site={site}` |
| List blocked | GET | `/api/v1/admin/blocked?site={site}` |
| Verify/Unverify | PUT | `/api/v1/admin/verify/{userId}?site={site}&verified=[0\|1]` |

### Data Management
| Action | Method | Endpoint |
|--------|--------|----------|
| Export | GET | `/api/v1/admin/export?site={site}&mode=file` |
| Import (file) | POST | `/api/v1/admin/import/form?site={site}&provider={type}` |
| Wait for op | GET | `/api/v1/admin/wait?site={site}&timeout=15m` |

---

## Feature Breakdown by Phase

### Phase 1 — Foundation & Auth
> Project scaffold, Velzon integration, authentication flow

1. **Project Setup**
   - Initialize CRA with Velzon template assets
   - Copy Velzon layout components (Header, Sidebar, Footer)
   - Configure SCSS theming (default theme)
   - Set up Redux store with layout slice
   - Configure React Router with public/protected routes

2. **Authentication**
   - Auth guard component that calls `GET /api/v1/user?site={site}`
   - Login page with "Sign in with Google" button → redirects to `/auth/google/login?from=/admin`
   - Logout handler → `/auth/logout`
   - User context/state from auth response (including `user.picture` for Google avatar)
   - Admin check: verify `user.admin === true`

3. **Layout & Navigation**
   - Responsive sidebar with menu items: Dashboard, Posts, Comments, Users, Settings
   - Header with site selector dropdown (escrevida / lauraesteves)
   - Profile dropdown showing Google account photo (`user.picture`) and display name
   - Mobile hamburger menu
   - Dark/Light mode toggle
   - Breadcrumb navigation

### Phase 2 — Posts & Comments
> Core comment management — the main use case

4. **Posts List Page**
   - Table showing all posts with: URL/title, comment count, first/last comment date
   - Sortable columns
   - Search/filter by URL
   - Click row → navigate to post's comments
   - Toggle read-only per post
   - Pagination

5. **Post Comments Page**
   - Show post URL/title at top
   - Flat list of all comments for the post (sorted by time)
   - Each comment card shows: author (avatar + name), text (rendered HTML), timestamp, score, pin status
   - Action buttons per comment: Delete, Pin/Unpin
   - Author link → navigate to user's comments
   - Read-only toggle for the post
   - Responsive card layout for mobile

6. **Recent Comments Page**
   - Latest N comments across all posts
   - Same comment card layout as post comments
   - Filter by time range (since parameter)
   - Post URL shown per comment (clickable → post comments page)
   - Quick actions: Delete, Pin

### Phase 3 — User Management
> Moderation tools for users

7. **Blocked Users Page**
   - List all blocked users with block reason/duration
   - Unblock action
   - Search blocked users

8. **User Detail / User Comments Page**
   - User info header (name, avatar, verified status, blocked status)
   - List of user's comments (paginated)
   - Action buttons: Block/Unblock (with optional TTL), Verify/Unverify, Delete all comments
   - Confirmation modals for destructive actions

### Phase 4 — Dashboard & Polish
> Overview and quality of life

9. **Dashboard Page**
   - Total comments count
   - Comments today / this week
   - Recent comments list (last 10)
   - Top posts by comment count
   - Quick links to common actions

10. **Site Settings / Config Viewer**
    - Display site configuration from `/api/v1/config`
    - Show: version, edit duration, max comment size, auth providers, scoring
    - Read-only (config changes require server restart)

### Phase 5 — Advanced Features
> Export, import, and extras

11. **Export/Import**
    - Export button → downloads gzip backup
    - Import form → file upload with provider selector (disqus, wordpress, remark, commento)
    - Progress indicator using `/admin/wait` endpoint

12. **Deployment**
    - Dockerfile: multi-stage (node build → caddy serve)
    - GitHub Actions: build + push to GHCR on main
    - Docker Compose service in server-apps
    - Caddyfile route: `/admin/*` → admin-ui container

---

## GitHub Issues Breakdown

Below are the issues to create, organized by phase. Each issue is self-contained and implementable independently (after its dependencies).

### Phase 1 — Foundation & Auth

#### Issue #1: Project scaffolding with Velzon template
**Labels:** `setup`, `phase-1`
**Description:**
Initialize the React project using Create React App and integrate Velzon template assets.

**Tasks:**
- Initialize CRA project
- Copy Velzon assets: SCSS themes, layout constants, common components (BreadCrumb, DeleteModal, Loader, withRouter)
- Install dependencies: reactstrap, bootstrap, redux toolkit, react-redux, react-router-dom, axios, formik, yup, remixicon, react-toastify, simplebar-react, sass
- Configure SCSS entry point (themes.scss with default theme)
- Set up `config.js` with `REACT_APP_API_URL` and `REACT_APP_SITE_ID` env vars
- Create `.env.example`
- Verify `npm start` works with a blank page + Velzon styling

**Acceptance Criteria:**
- App starts on `localhost:3000`
- Velzon CSS/SCSS loads correctly
- No console errors

---

#### Issue #2: Redux store and layout management
**Labels:** `setup`, `phase-1`
**Depends on:** #1

**Description:**
Set up Redux Toolkit store with layout slice for theme/sidebar state management.

**Tasks:**
- Create Redux store with `configureStore`
- Port Velzon layout slice (reducer + constants) for sidebar type, theme mode, sidebar size
- Wrap App with Redux Provider
- Verify dark/light mode toggle works in state

**Acceptance Criteria:**
- Redux DevTools shows layout state
- Layout actions dispatch correctly

---

#### Issue #3: Routing and authentication guard
**Labels:** `auth`, `phase-1`
**Depends on:** #2

**Description:**
Implement React Router with public/protected route split and authentication guard that validates admin status via the Remark42 API.

**Tasks:**
- Create `Routes/index.js` with public and protected route rendering
- Create `AuthProtected.js` component:
  - On mount, call `GET /api/v1/user?site={siteId}` with `credentials: 'include'`
  - If response has `admin: true`, allow access
  - If 401 or non-admin, redirect to login page
  - Store user info in Redux auth slice (including `user.picture` for Google profile photo)
- Create auth Redux slice (user state with picture, loading, error)
- Create `helpers/api_helper.js` with Axios instance configured for cookie-based auth (`withCredentials: true`)
- Create login page with "Sign in with Google" button that redirects to `/auth/google/login?from=/admin`
- Create logout handler

**Acceptance Criteria:**
- Unauthenticated users see login page
- Authenticated non-admins see "access denied" message
- Authenticated admins see protected content
- User picture from Google account is stored in auth state
- Logout clears state and shows login page

---

#### Issue #4: Layout — sidebar, header, and responsive shell
**Labels:** `ui`, `phase-1`
**Depends on:** #3

**Description:**
Implement the main application layout with responsive sidebar navigation, header with site selector, and footer.

**Tasks:**
- Port Velzon VerticalLayout components (Header, Sidebar, Footer, main content wrapper)
- Create `LayoutMenuData.js` with menu items:
  - Dashboard (ri-dashboard-2-line)
  - Posts (ri-article-line)
  - Comments (ri-chat-3-line)
  - Users (ri-user-line)
  - Settings (ri-settings-3-line)
- Header: site selector dropdown (escrevida / lauraesteves), dark/light toggle, user profile dropdown with Google account photo (`user.picture`) and display name, logout option
- Sidebar: collapsible on mobile, icons + labels
- Footer: minimal
- Responsive: sidebar collapses to hamburger on mobile
- SimpleBar for sidebar scrolling

**Acceptance Criteria:**
- Sidebar navigates between pages
- Site selector switches `SITE_ID` in app state
- Mobile: hamburger menu opens/closes sidebar overlay
- Dark/Light toggle works
- Layout matches Velzon default theme

---

### Phase 2 — Posts & Comments

#### Issue #5: API helper layer for Remark42 endpoints
**Labels:** `api`, `phase-2`
**Depends on:** #3

**Description:**
Create the API abstraction layer with URL constants and helper functions for all Remark42 endpoints.

**Tasks:**
- Create `helpers/url_helper.js` with all endpoint URL constants
- Create `helpers/backend_helper.js` with wrapper functions:
  - `getConfig(site)` → GET /config
  - `getPostsList(site, limit, skip)` → GET /list
  - `getPostInfo(site, url)` → GET /info
  - `getCommentsByPost(site, url, sort)` → GET /find
  - `getLastComments(site, limit, since)` → GET /last
  - `getUserComments(site, userId, limit, skip)` → GET /comments
  - `getComment(site, id)` → GET /id
  - `deleteComment(site, id, url)` → DELETE /admin/comment
  - `pinComment(site, id, url, pin)` → PUT /admin/pin
  - `setReadOnly(site, url, ro)` → PUT /admin/readonly
  - `getUserInfo(site, userId)` → GET /admin/user
  - `blockUser(site, userId, block, ttl)` → PUT /admin/user
  - `deleteUser(site, userId)` → DELETE /admin/user
  - `getBlockedUsers(site)` → GET /admin/blocked
  - `verifyUser(site, userId, verified)` → PUT /admin/verify
  - `exportData(site)` → GET /admin/export
  - `importData(site, provider, file)` → POST /admin/import/form
  - `waitForOperation(site, timeout)` → GET /admin/wait
- All functions use the APIClient from `api_helper.js`

**Acceptance Criteria:**
- All endpoints callable
- Cookie-based auth works (withCredentials)
- Error responses handled gracefully

---

#### Issue #6: Posts list page
**Labels:** `feature`, `phase-2`
**Depends on:** #4, #5

**Description:**
Create the Posts page showing all posts (URLs) that have comments, with comment counts and management actions.

**Tasks:**
- Create `slices/posts/` with async thunks for fetching posts list
- Create `pages/Posts/PostsList.js`:
  - Fetch posts via `GET /api/v1/list?site={site}&limit=50&skip=0`
  - Table columns: Post URL (truncated, with tooltip for full URL), Comment Count, Last Comment Date
  - Click row → navigate to `/posts/:encodedUrl` (post comments page)
  - Pagination controls (prev/next with skip/limit)
  - Search filter for URL
  - Read-only toggle button per row (calls PUT /admin/readonly)
  - Badge indicating read-only posts
- Responsive: on mobile, show cards instead of table rows
- Loading skeleton while fetching
- Empty state for no posts

**Acceptance Criteria:**
- Posts load and display in paginated table
- Search filters posts by URL
- Click navigates to post comments
- Read-only toggle works with confirmation
- Mobile-friendly layout

---

#### Issue #7: Post comments page
**Labels:** `feature`, `phase-2`
**Depends on:** #6

**Description:**
View and manage all comments for a specific post.

**Tasks:**
- Create `slices/comments/` with thunks for comment operations
- Create `pages/Posts/PostComments.js`:
  - Header: post URL/title, comment count, read-only status toggle
  - Fetch comments via `GET /api/v1/find?site={site}&url={url}&format=plain&sort=-time`
  - Comment list (Card-based layout):
    - Author avatar + name (clickable → user comments page)
    - Verified badge if verified
    - Comment text (rendered HTML, sanitized)
    - Timestamp (relative: "2 hours ago")
    - Score display
    - Pin indicator
    - Actions dropdown: Delete, Pin/Unpin
  - Delete confirmation modal
  - Toast notifications on actions
  - Sort selector: newest, oldest, best score, most controversial
- Responsive comment cards for mobile

**Acceptance Criteria:**
- Comments load for selected post
- Delete removes comment with confirmation
- Pin/Unpin toggles pin status
- Author links work
- Sort options work
- Mobile: comment cards stack vertically

---

#### Issue #8: Recent comments page
**Labels:** `feature`, `phase-2`
**Depends on:** #7

**Description:**
View latest comments across all posts with quick moderation actions.

**Tasks:**
- Create `pages/Comments/RecentComments.js`:
  - Fetch via `GET /api/v1/last/{limit}?site={site}`
  - Same comment card component as post comments (extract shared component)
  - Additional info per comment: post URL (clickable → post comments page)
  - Configurable limit (25, 50, 100)
  - Time filter (last hour, today, this week, all time) using `since` parameter
  - Auto-refresh toggle (poll every 30s)
- Extract `CommentCard` as reusable component from #7

**Acceptance Criteria:**
- Shows latest comments across all posts
- Post URL links navigate to post comments
- Time filter works
- Limit selector works
- Same moderation actions as post comments page

---

### Phase 3 — User Management

#### Issue #9: Blocked users page
**Labels:** `feature`, `phase-3`
**Depends on:** #5

**Description:**
List and manage blocked users.

**Tasks:**
- Create `slices/users/` with thunks for user operations
- Create `pages/Users/BlockedUsers.js`:
  - Fetch via `GET /api/v1/admin/blocked?site={site}`
  - Table: User name/ID, Block duration (permanent or TTL remaining), Blocked since
  - Unblock action button per row (with confirmation modal)
  - Empty state: "No blocked users"
- Responsive table/card layout

**Acceptance Criteria:**
- Blocked users list loads
- Unblock action works with confirmation
- Shows block duration info
- Mobile-friendly

---

#### Issue #10: User detail and user comments page
**Labels:** `feature`, `phase-3`
**Depends on:** #9

**Description:**
View user profile, their comments, and perform moderation actions.

**Tasks:**
- Create `pages/Users/UserDetail.js`:
  - Route: `/users/:userId`
  - Header card: user name, avatar, ID, verified status, blocked status
  - Action buttons:
    - Block/Unblock (modal with optional TTL: 1 day, 7 days, 30 days, permanent)
    - Verify/Unverify toggle
    - Delete all comments (confirmation modal with strong warning)
  - Comments list: paginated user comments via `GET /api/v1/comments?site={site}&user={userId}&limit=20&skip=0`
  - Each comment shows: post URL, text, timestamp, score
  - Pagination for comments (limit/skip)

**Acceptance Criteria:**
- User info displays correctly
- Block with TTL options works
- Verify toggle works
- Delete all comments works with confirmation
- User's comments paginate correctly
- Navigation back to referrer page

---

### Phase 4 — Dashboard & Polish

#### Issue #11: Dashboard page
**Labels:** `feature`, `phase-4`
**Depends on:** #8

**Description:**
Create an overview dashboard with key metrics and recent activity.

**Tasks:**
- Create `slices/dashboard/` with data fetching thunks
- Create `pages/Dashboard/index.js`:
  - Stats row (Widget cards):
    - Total posts (from list endpoint count)
    - Recent comments count (last 24h using `since` filter)
  - Recent comments section: last 10 comments with quick actions (reuse CommentCard)
  - Top posts section: posts sorted by comment count (first page of /list)
  - Quick action buttons: "View All Posts", "View Recent Comments"
- Responsive grid: 2 columns on desktop, 1 on mobile

**Acceptance Criteria:**
- Dashboard loads with real data
- Stats reflect actual counts
- Recent comments show with actions
- Quick navigation links work
- Mobile: cards stack vertically

---

#### Issue #12: Site configuration viewer
**Labels:** `feature`, `phase-4`
**Depends on:** #5

**Description:**
Display the Remark42 site configuration in a read-only settings page.

**Tasks:**
- Create `pages/Settings/SiteSettings.js`:
  - Fetch via `GET /api/v1/config?site={site}`
  - Display sections:
    - General: version, max comment size, edit duration, low/critical score thresholds
    - Auth providers: list of enabled providers
    - Admin emails: list
    - Notifications: email/Telegram status
  - Read-only display (info alert explaining config changes need server restart)
  - Card-based layout

**Acceptance Criteria:**
- Config data displays correctly
- Clear sections for different config areas
- Info message about read-only nature

---

### Phase 5 — Advanced Features

#### Issue #13: Data export and import
**Labels:** `feature`, `phase-5`
**Depends on:** #5

**Description:**
Add export/import functionality for site data backup and migration.

**Tasks:**
- Create `pages/Settings/DataManagement.js` (or section in SiteSettings):
  - **Export:**
    - "Export All Comments" button
    - Calls `GET /api/v1/admin/export?site={site}&mode=file`
    - Downloads gzip file
  - **Import:**
    - File upload dropzone (Filepond or React-Dropzone)
    - Provider selector: Disqus, WordPress, Remark, Commento
    - Submit → `POST /api/v1/admin/import/form`
    - Progress: poll `GET /api/v1/admin/wait?site={site}` until complete
    - Success/error toast
  - Warning messages about import overwriting data

**Acceptance Criteria:**
- Export downloads a .gz file
- Import accepts file + provider, shows progress
- Error handling for failed imports
- Clear warnings before destructive operations

---

#### Issue #14: Docker build and CI/CD pipeline
**Labels:** `devops`, `phase-5`
**Depends on:** #1

**Description:**
Set up Docker build and GitHub Actions for automated deployment.

**Tasks:**
- Create `Dockerfile`:
  ```dockerfile
  # Build stage
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  ARG REACT_APP_API_URL
  ARG REACT_APP_SITE_ID
  RUN npm run build

  # Serve stage
  FROM caddy:2-alpine
  COPY Caddyfile /etc/caddy/Caddyfile
  COPY --from=build /app/build /srv
  ```
- Create `Caddyfile` for static file serving under `/admin/`
- Create `.github/workflows/build-and-push.yml`:
  - Trigger: push to main
  - Build Docker image
  - Push to `ghcr.io/lauralesteves/remark42-admin-ui`
  - Tag with commit SHA and `latest`
- Create `.dockerignore`

**Acceptance Criteria:**
- `docker build` succeeds
- Image serves app correctly at `/admin/`
- GitHub Actions workflow runs on push to main
- Image pushed to GHCR

---

## Implementation Order

```
Phase 1 (Foundation):
  #1 Project scaffolding
  #2 Redux store + layout ──────┐
  #3 Routing + auth ────────────┤
  #4 Layout shell ──────────────┘

Phase 2 (Core Features):
  #5 API helpers
  #6 Posts list ────────────────┐
  #7 Post comments ─────────────┤
  #8 Recent comments ───────────┘

Phase 3 (Users):
  #9  Blocked users
  #10 User detail

Phase 4 (Dashboard):
  #11 Dashboard
  #12 Site config

Phase 5 (Ship It):
  #13 Export/Import
  #14 Docker + CI/CD
```

---

## Non-Functional Requirements

- **Responsive:** All pages must work on mobile (≥320px width)
- **Performance:** Paginate all lists, no loading of full datasets
- **Security:** Cookie-based auth (HttpOnly, Secure, SameSite), no tokens in localStorage
- **Error Handling:** Toast notifications for all API errors, loading states for all fetches
- **Accessibility:** Semantic HTML, keyboard navigation, ARIA labels on action buttons
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions)
