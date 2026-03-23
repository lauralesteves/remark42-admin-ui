import React from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={6}>
            {new Date().getFullYear()} &copy; Remark42 Admin
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
