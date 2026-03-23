import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const selectAuth = createSelector(
    (state) => state.Auth,
    (auth) => auth.user
  );
  const user = useSelector(selectAuth);

  const userName = user?.name || "Admin";
  const userPicture = user?.picture || avatar1;

  return (
    <Dropdown
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="ms-sm-3 header-item topbar-user"
    >
      <DropdownToggle tag="button" type="button" className="btn">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={userPicture}
            alt={userName}
          />
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
              {userName}
            </span>
            <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">
              Admin
            </span>
          </span>
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <h6 className="dropdown-header">Hello, {userName}!</h6>
        <DropdownItem className="p-0">
          <Link to="/logout" className="dropdown-item">
            <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Logout</span>
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
