import React from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const UserDetail = () => {
  const { userId } = useParams();

  document.title = "User Detail | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="User Detail" pageTitle="Users" />
        <div className="text-center mt-5">
          <h4 className="text-muted">User detail coming soon</h4>
          <p className="text-muted">{decodeURIComponent(userId)}</p>
        </div>
      </Container>
    </div>
  );
};

export default UserDetail;
