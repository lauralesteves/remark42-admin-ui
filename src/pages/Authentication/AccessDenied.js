import React from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  document.title = "Access Denied | Remark42 Admin";

  return (
    <React.Fragment>
      <div className="auth-page-wrapper pt-5">
        <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
          <div className="bg-overlay"></div>
        </div>
        <div className="auth-page-content">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-5">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <i className="ri-forbid-line display-3 text-danger"></i>
                      <h5 className="text-danger mt-3">Access Denied</h5>
                      <p className="text-muted mt-2">
                        Your account does not have admin privileges. Please
                        contact the site administrator.
                      </p>
                      <Link to="/logout">
                        <Button color="primary" className="mt-3">
                          <i className="ri-logout-box-r-line me-1"></i>
                          Sign out and try another account
                        </Button>
                      </Link>
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

export default AccessDenied;
