import React from "react";
import { Routes, Route } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
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
            element={
              <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
              </AuthProtected>
            }
            key={idx}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
