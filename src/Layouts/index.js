import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withRouter from "../Components/Common/withRouter";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
  changeSidebarVisibility,
} from "../slices/layouts/thunk";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Layout = (props) => {
  const dispatch = useDispatch();

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutType: layout.layoutType,
      leftSidebarType: layout.leftSidebarType,
      layoutModeType: layout.layoutModeType,
      layoutWidthType: layout.layoutWidthType,
      layoutPositionType: layout.layoutPositionType,
      topbarThemeType: layout.topbarThemeType,
      leftsidbarSizeType: layout.leftsidbarSizeType,
      leftSidebarViewType: layout.leftSidebarViewType,
      leftSidebarImageType: layout.leftSidebarImageType,
      sidebarVisibilitytype: layout.sidebarVisibilitytype,
    })
  );

  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
  } = useSelector(selectLayoutProperties);

  useEffect(() => {
    if (
      layoutType ||
      leftSidebarType ||
      layoutModeType ||
      layoutWidthType ||
      layoutPositionType ||
      topbarThemeType ||
      leftsidbarSizeType ||
      leftSidebarViewType ||
      leftSidebarImageType ||
      sidebarVisibilitytype
    ) {
      window.dispatchEvent(new Event("resize"));
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
      dispatch(changeSidebarImageType(leftSidebarImageType));
      dispatch(changeSidebarVisibility(sidebarVisibilitytype));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
    dispatch,
  ]);

  const onChangeLayoutMode = (value) => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value));
    }
  };

  const [headerClass, setHeaderClass] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  });

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass("topbar-shadow");
    } else {
      setHeaderClass("");
    }
  }

  useEffect(() => {
    if (
      sidebarVisibilitytype === "show" ||
      layoutType === "vertical" ||
      layoutType === "twocolumn"
    ) {
      document.querySelector(".hamburger-icon")?.classList.remove("open");
    } else {
      document.querySelector(".hamburger-icon")?.classList.add("open");
    }
  }, [sidebarVisibilitytype, layoutType]);

  return (
    <div id="layout-wrapper">
      <Header
        headerClass={headerClass}
        layoutModeType={layoutModeType}
        onChangeLayoutMode={onChangeLayoutMode}
      />
      <Sidebar layoutType={layoutType} />
      <div className="main-content">
        {props.children}
        <Footer />
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(Layout);
