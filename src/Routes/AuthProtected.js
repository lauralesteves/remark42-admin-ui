import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { checkAuth } from "../slices/auth/thunk";
import Loader from "../Components/Common/Loader";

const AuthProtected = ({ children }) => {
  const dispatch = useDispatch();

  const selectAuth = createSelector(
    (state) => state.Auth,
    (auth) => ({
      user: auth.user,
      isAdmin: auth.isAdmin,
      loading: auth.loading,
      error: auth.error,
    })
  );
  const { user, isAdmin, loading, error } = useSelector(selectAuth);

  useEffect(() => {
    if (!user && loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, user, loading]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Loader />
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
};

export { AuthProtected };
