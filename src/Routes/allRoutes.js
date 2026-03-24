import React from "react";
import { Navigate } from "react-router-dom";

import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import AccessDenied from "../pages/Authentication/AccessDenied";
import Dashboard from "../pages/Dashboard";
import PostsList from "../pages/Posts/PostsList";
import PostComments from "../pages/Posts/PostComments";
import UserDetail from "../pages/Users/UserDetail";
import BlockedUsers from "../pages/Users/BlockedUsers";
import RecentComments from "../pages/Comments/RecentComments";
import SiteSettings from "../pages/Settings/SiteSettings";
import DataManagement from "../pages/Settings/DataManagement";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/posts", component: <PostsList /> },
  { path: "/posts/:url", component: <PostComments /> },
  { path: "/comments", component: <RecentComments /> },
  { path: "/users", component: <BlockedUsers /> },
  { path: "/users/:userId", component: <UserDetail /> },
  { path: "/settings", component: <SiteSettings /> },
  { path: "/settings/data", component: <DataManagement /> },

  // Catch all — redirect to dashboard
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/access-denied", component: <AccessDenied /> },
];

export { authProtectedRoutes, publicRoutes };
