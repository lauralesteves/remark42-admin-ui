import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { logoutUser } from "../../slices/auth/thunk";

const Logout = () => {
  const dispatch = useDispatch();

  const selectLogout = createSelector(
    (state) => state.Auth,
    (auth) => auth.isUserLogout
  );
  const isUserLogout = useSelector(selectLogout);

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  if (isUserLogout) {
    return <Navigate to="/login" />;
  }

  return <></>;
};

export default Logout;
