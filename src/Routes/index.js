import React from "react";
import { Routes, Route } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";

const AppRoutes = () => {
  return (
    <Routes>
      <Route>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
          />
        ))}
      </Route>
      <Route>
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<AuthProtected>{route.component}</AuthProtected>}
            key={idx}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
