import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import { Collapse } from "reactstrap";
import navdata from "../LayoutMenuData";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const VerticalLayout = (props) => {
  const navData = navdata().props.children;

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      leftsidbarSizeType: layout.leftsidbarSizeType,
      sidebarVisibilitytype: layout.sidebarVisibilitytype,
      layoutType: layout.layoutType,
    })
  );
  const { leftsidbarSizeType, sidebarVisibilitytype, layoutType } =
    useSelector(selectLayoutProperties);

  const resizeSidebarMenu = useCallback(() => {
    var windowSize = document.documentElement.clientWidth;
    if (windowSize >= 1025) {
      if (
        document.documentElement.getAttribute("data-layout") === "vertical"
      ) {
        document.documentElement.setAttribute(
          "data-sidebar-size",
          leftsidbarSizeType
        );
      }
      var hamburgerIcon = document.querySelector(".hamburger-icon");
      if (
        (sidebarVisibilitytype === "show" ||
          layoutType === "vertical" ||
          layoutType === "twocolumn") &&
        hamburgerIcon
      ) {
        hamburgerIcon.classList.remove("open");
      } else if (hamburgerIcon) {
        hamburgerIcon.classList.add("open");
      }
    } else if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove("twocolumn-panel");
      if (
        document.documentElement.getAttribute("data-layout") === "vertical"
      ) {
        document.documentElement.setAttribute("data-sidebar-size", "sm");
      }
      if (document.querySelector(".hamburger-icon")) {
        document.querySelector(".hamburger-icon").classList.add("open");
      }
    } else if (windowSize <= 767) {
      document.body.classList.remove("vertical-sidebar-enable");
      if (
        document.documentElement.getAttribute("data-layout") !== "horizontal"
      ) {
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
      if (document.querySelector(".hamburger-icon")) {
        document.querySelector(".hamburger-icon").classList.add("open");
      }
    }
  }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

  useEffect(() => {
    window.addEventListener("resize", resizeSidebarMenu, true);
  }, [resizeSidebarMenu]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const initMenu = () => {
      const pathName =
        process.env.PUBLIC_URL + props.router.location.pathname;
      const ul = document.getElementById("navbar-nav");
      const items = ul.getElementsByTagName("a");
      let itemsArray = [...items];
      removeActivation(itemsArray);
      let matchingMenuItem = itemsArray.find((x) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    if (props.layoutType === "vertical") {
      initMenu();
    }
  }, [props.router.location.pathname, props.layoutType]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (
        parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")
      ) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
      }
      return false;
    }
    return false;
  }

  const removeActivation = (items) => {
    let actiItems = items.filter((x) => x.classList.contains("active"));
    actiItems.forEach((item) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  };

  return (
    <React.Fragment>
      {(navData || []).map((item, key) => {
        return (
          <React.Fragment key={key}>
            {item["isHeader"] ? (
              <li className="menu-title">
                <span data-key="t-menu">{props.t(item.label)}</span>
              </li>
            ) : item.subItems ? (
              <li className="nav-item">
                <Link
                  onClick={item.click}
                  className="nav-link menu-link"
                  to={item.link ? item.link : "/#"}
                  data-bs-toggle="collapse"
                >
                  <i className={item.icon}></i>{" "}
                  <span data-key="t-apps">{props.t(item.label)}</span>
                </Link>
                <Collapse
                  className="menu-dropdown"
                  isOpen={item.stateVariables}
                  id="sidebarApps"
                >
                  <ul className="nav nav-sm flex-column test">
                    {(item.subItems || []).map((subItem, subKey) => (
                      <li className="nav-item" key={subKey}>
                        <Link
                          to={subItem.link ? subItem.link : "/#"}
                          className="nav-link"
                        >
                          {props.t(subItem.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link menu-link"
                  to={item.link ? item.link : "/#"}
                >
                  <i className={item.icon}></i>{" "}
                  <span>{props.t(item.label)}</span>
                </Link>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
