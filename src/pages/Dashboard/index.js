import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Dashboard = () => {
  document.title = "Dashboard | Remark42 Admin";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Remark42" />
          <div className="text-center mt-5">
            <h4 className="text-muted">Dashboard coming soon</h4>
            <p className="text-muted">
              Authentication is working. You're logged in as an admin.
            </p>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
