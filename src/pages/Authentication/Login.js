import React from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { api } from "../../config";
import logoLight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

const Login = () => {
  const selectAuthState = createSelector(
    (state) => state.Auth,
    (auth) => ({
      user: auth.user,
      isAdmin: auth.isAdmin,
      loading: auth.loading,
    })
  );
  const { user, isAdmin, loading } = useSelector(selectAuthState);

  const selectTheme = createSelector(
    (state) => state.Layout,
    (layout) => layout.layoutModeType
  );
  const layoutMode = useSelector(selectTheme);

  if (user && isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (user && !isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  const handleGoogleLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.href = `${api.API_URL}/auth/google/login?site=${api.SITE_ID}&from=${returnUrl}`;
  };

  const handleDevLogin = () => {
    const returnUrl = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.href = `${api.API_URL}/auth/dev/login?site=${api.SITE_ID}&from=${returnUrl}`;
  };

  document.title = "Sign In | Remark42 Admin";

  const isDev =
    api.API_URL.includes("127.0.0.1") || api.API_URL.includes("localhost");

  return (
    <React.Fragment>
      <div className="auth-page-wrapper pt-5">
        <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
          <div className="bg-overlay"></div>
        </div>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4">
                  <img
                    src={layoutMode === "dark" ? logoLight : logoDark}
                    alt="Remark42 Admin"
                    height="80"
                  />
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Remark42 Admin</h5>
                      <p className="text-muted">
                        Sign in to manage your comments.
                      </p>
                    </div>
                    <div className="p-2 mt-4">
                      <div className="d-grid gap-2">
                        <Button
                          color="danger"
                          className="btn-label"
                          onClick={handleGoogleLogin}
                          disabled={loading}
                        >
                          <i className="ri-google-fill label-icon align-middle fs-16 me-2"></i>
                          Sign in with Google
                        </Button>
                        {isDev && (
                          <Button
                            color="secondary"
                            className="btn-label mt-2"
                            onClick={handleDevLogin}
                          >
                            <i className="ri-code-s-slash-line label-icon align-middle fs-16 me-2"></i>
                            Dev Login (local only)
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
