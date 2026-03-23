import React from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const PostComments = () => {
  const { url } = useParams();
  const postUrl = decodeURIComponent(url);

  document.title = "Post Comments | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Post Comments" pageTitle="Posts" />
        <div className="text-center mt-5">
          <h4 className="text-muted">Post comments coming soon</h4>
          <p className="text-muted">{postUrl}</p>
        </div>
      </Container>
    </div>
  );
};

export default PostComments;
