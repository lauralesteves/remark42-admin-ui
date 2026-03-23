import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { changeSiteId } from "../../slices/auth/reducer";

const SITES = ["escrevida", "lauraesteves"];

const SiteSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const selectSiteId = createSelector(
    (state) => state.Auth,
    (auth) => auth.siteId
  );
  const siteId = useSelector(selectSiteId);

  const handleSelect = (site) => {
    dispatch(changeSiteId(site));
  };

  return (
    <Dropdown
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className="d-flex align-items-center header-item"
    >
      <DropdownToggle
        tag="button"
        type="button"
        className="btn btn-ghost-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
      >
        <i className="ri-global-line fs-16"></i>
        <span className="fw-medium">{siteId}</span>
        <i className="ri-arrow-down-s-line"></i>
      </DropdownToggle>
      <DropdownMenu>
        <h6 className="dropdown-header">Select Site</h6>
        {SITES.map((site) => (
          <DropdownItem
            key={site}
            active={site === siteId}
            onClick={() => handleSelect(site)}
          >
            {site}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SiteSelector;
