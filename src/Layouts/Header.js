import React from "react";
import { Link } from "react-router-dom";

import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";
import SiteSelector from "../Components/Common/SiteSelector";

import { changeSidebarVisibility } from "../slices/layouts/thunk";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();

  const selectSidebarVisibility = createSelector(
    (state) => state.Layout,
    (layout) => layout.sidebarVisibilitytype
  );
  const sidebarVisibilitytype = useSelector(selectSidebarVisibility);

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767)
      document.querySelector(".hamburger-icon")?.classList.toggle("open");

    if (
      sidebarVisibilitytype === "show" &&
      document.documentElement.getAttribute("data-layout") === "vertical"
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }
  };

  return (
    <header id="page-topbar" className={headerClass}>
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box horizontal-logo">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="34" />
                </span>
              </Link>
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="34" />
                </span>
              </Link>
            </div>

            <button
              onClick={toogleMenuBtn}
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          <div className="d-flex align-items-center">
            <SiteSelector />
            <FullScreenDropdown />
            <LightDark
              layoutMode={layoutModeType}
              onChangeLayoutMode={onChangeLayoutMode}
            />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
