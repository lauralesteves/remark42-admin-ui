import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  InputGroup,
} from "reactstrap";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { api } from "../../config";

const EMBED_SCRIPT_ID = "remark42-embed-script";

const Demo = () => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const [postUrl, setPostUrl] = useState(window.location.origin + "/demo");
  const [inputUrl, setInputUrl] = useState(postUrl);
  const scriptLoaded = useRef(false);

  const selectTheme = createSelector(
    (state) => state.Layout,
    (layout) => layout.layoutModeType
  );
  const layoutMode = useSelector(selectTheme);

  // Determine the remark42 host — use API_URL if set, otherwise same origin
  // (in dev, the CRA proxy forwards to remark42)
  const remarkHost = api.API_URL || window.location.origin;

  const loadScript = useCallback(() => {
    if (scriptLoaded.current) return;

    window.remark_config = {
      host: remarkHost,
      site_id: api.SITE_ID,
      components: ["embed"],
    };

    const script = document.createElement("script");
    script.id = EMBED_SCRIPT_ID;
    script.src = `${remarkHost}/web/embed.js`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, [remarkHost]);

  const initWidget = useCallback(() => {
    if (!containerRef.current) return;

    // Destroy previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    if (window.REMARK42) {
      instanceRef.current = window.REMARK42.createInstance({
        node: containerRef.current,
        host: remarkHost,
        site_id: api.SITE_ID,
        url: postUrl,
        theme: layoutMode === "dark" ? "dark" : "light",
        max_shown_comments: 30,
      });
    }
  }, [postUrl, remarkHost, layoutMode]);

  // Load embed script on mount
  useEffect(() => {
    loadScript();
  }, [loadScript]);

  // Init widget when REMARK42 is ready or when postUrl/theme changes
  useEffect(() => {
    if (window.REMARK42) {
      initWidget();
    } else {
      const onReady = () => initWidget();
      window.addEventListener("REMARK42::ready", onReady);
      return () => window.removeEventListener("REMARK42::ready", onReady);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [initWidget]);

  const handleLoadUrl = (e) => {
    e.preventDefault();
    setPostUrl(inputUrl);
  };

  document.title = "Demo | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Demo" pageTitle="Remark42" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <h5 className="card-title mb-0 flex-grow-1">
                    Comment Widget Preview
                  </h5>
                </div>
                <p className="text-muted mt-2 mb-0">
                  Preview the comment widget for any post URL. Enter a URL below
                  to load its comments.
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleLoadUrl}>
                  <InputGroup className="mb-4">
                    <Input
                      type="url"
                      placeholder="Enter post URL..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                    <Button color="primary" type="submit">
                      <i className="ri-refresh-line me-1"></i>Load
                    </Button>
                  </InputGroup>
                </form>

                <div ref={containerRef}></div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Demo;
