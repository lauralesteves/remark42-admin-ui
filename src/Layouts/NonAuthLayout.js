import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import withRouter from "../Components/Common/withRouter";

const NonAuthLayout = ({ children }) => {
  const selectTheme = createSelector(
    (state) => state.Layout,
    (layout) => layout.layoutModeType
  );
  const layoutModeType = useSelector(selectTheme);

  useEffect(() => {
    if (layoutModeType === "dark") {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
    }
    return () => {
      document.body.removeAttribute("data-bs-theme");
    };
  }, [layoutModeType]);

  return <div>{children}</div>;
};

export default withRouter(NonAuthLayout);
