import React, { useState } from "react";

const FullScreenDropdown = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="ms-1 header-item d-none d-sm-flex">
      <button
        onClick={toggleFullscreen}
        type="button"
        className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      >
        <i
          className={
            isFullScreen
              ? "bx bx-exit-fullscreen fs-22"
              : "bx bx-fullscreen fs-22"
          }
        ></i>
      </button>
    </div>
  );
};

export default FullScreenDropdown;
