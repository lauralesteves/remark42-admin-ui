import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
  }, [history, iscurrentState]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      click: function (e) {
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "posts",
      label: "Posts",
      icon: "ri-article-line",
      link: "/posts",
      click: function (e) {
        setIscurrentState("Posts");
        updateIconSidebar(e);
      },
    },
    {
      id: "comments",
      label: "Comments",
      icon: "ri-chat-3-line",
      link: "/comments",
      click: function (e) {
        setIscurrentState("Comments");
        updateIconSidebar(e);
      },
    },
    {
      id: "users",
      label: "Users",
      icon: "ri-user-line",
      link: "/users",
      click: function (e) {
        setIscurrentState("Users");
        updateIconSidebar(e);
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: "ri-settings-3-line",
      link: "/settings",
      click: function (e) {
        setIscurrentState("Settings");
        updateIconSidebar(e);
      },
    },
    {
      id: "data",
      label: "Data",
      icon: "ri-database-2-line",
      link: "/settings/data",
      click: function (e) {
        setIscurrentState("Data");
        updateIconSidebar(e);
      },
    },
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
