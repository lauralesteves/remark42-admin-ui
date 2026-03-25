import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Button, Spinner } from "reactstrap";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { api } from "../../config";
import { getConfig } from "../../helpers/backend_helper";
import logoLight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

const PROVIDER_META = {
  google: { icon: "ri-google-fill", color: "danger", label: "Google" },
  github: { icon: "ri-github-fill", color: "dark", label: "GitHub" },
  facebook: { icon: "ri-facebook-fill", color: "primary", label: "Facebook" },
  microsoft: { icon: "ri-microsoft-fill", color: "info", label: "Microsoft" },
  apple: { icon: "ri-apple-fill", color: "dark", label: "Apple" },
  twitter: { icon: "ri-twitter-x-fill", color: "dark", label: "Twitter" },
  discord: { icon: "ri-discord-fill", color: "primary", label: "Discord" },
  telegram: { icon: "ri-telegram-fill", color: "info", label: "Telegram" },
  patreon: { icon: "ri-patreon-fill", color: "warning", label: "Patreon" },
  yandex: { icon: "ri-global-line", color: "danger", label: "Yandex" },
  dev: { icon: "ri-code-s-slash-line", color: "secondary", label: "Dev Login (local only)" },
  email: { icon: "ri-mail-line", color: "success", label: "Email" },
  anonymous: { icon: "ri-user-line", color: "secondary", label: "Anonymous" },
};

const Login = () => {
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

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

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const config = await getConfig(api.SITE_ID);
        setProviders(config.auth_providers || []);
      } catch {
        setProviders(["google"]);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  if (user && isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (user && !isAdmin) {
    return <Navigate to="/access-denied" />;
  }

  const baseUrl = api.API_URL || "";

  const handleLogin = (provider) => {
    const returnUrl = encodeURIComponent(window.location.origin + (process.env.PUBLIC_URL || "") + "/dashboard");
    window.location.href = `${baseUrl}/auth/${provider}/login?site=${api.SITE_ID}&from=${returnUrl}`;
  };

  // Filter out anonymous (not a login provider) and email (needs separate flow)
  const loginProviders = providers.filter(
    (p) => p !== "anonymous" && p !== "email"
  );

  document.title = "Sign In | Remark42 Admin";

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
                        {loadingProviders ? (
                          <div className="text-center py-3">
                            <Spinner color="primary" size="sm" />
                          </div>
                        ) : (
                          loginProviders.map((provider) => {
                            const meta = PROVIDER_META[provider] || {
                              icon: "ri-login-box-line",
                              color: "secondary",
                              label: provider,
                            };
                            return (
                              <Button
                                key={provider}
                                color={meta.color}
                                className="btn-label"
                                onClick={() => handleLogin(provider)}
                                disabled={loading}
                              >
                                <i
                                  className={`${meta.icon} label-icon align-middle fs-16 me-2`}
                                ></i>
                                Sign in with {meta.label}
                              </Button>
                            );
                          })
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
