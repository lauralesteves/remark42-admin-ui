import React, { useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Badge,
  Input,
} from "reactstrap";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import CommentCard from "../../Components/Comments/CommentCard";
import {
  getComments,
  removeComment,
  togglePin,
  clearComments,
} from "../../slices/comments/reducer";
import { toggleReadOnly } from "../../slices/posts/reducer";

const SORT_OPTIONS = [
  { value: "-time", label: "Newest first" },
  { value: "+time", label: "Oldest first" },
  { value: "-score", label: "Best score" },
  { value: "-controversy", label: "Most controversial" },
];

const PostComments = () => {
  const { url } = useParams();
  const postUrl = decodeURIComponent(url);
  const dispatch = useDispatch();

  const [sort, setSort] = React.useState("-time");

  const selectComments = createSelector(
    (state) => state.Comments,
    (comments) => ({
      commentsList: comments.comments,
      loading: comments.loading,
    })
  );
  const { commentsList, loading } = useSelector(selectComments);

  const selectPost = createSelector(
    (state) => state.Posts,
    (posts) => posts.posts.find((p) => p.url === postUrl)
  );
  const post = useSelector(selectPost);

  useEffect(() => {
    dispatch(getComments({ postUrl, sort }));
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, postUrl, sort]);

  const handleDelete = useCallback(
    (id) => {
      dispatch(removeComment({ id, postUrl }));
    },
    [dispatch, postUrl]
  );

  const handleTogglePin = useCallback(
    (id, pin) => {
      dispatch(togglePin({ id, postUrl, pin }));
    },
    [dispatch, postUrl]
  );

  const handleReadOnlyToggle = useCallback(() => {
    if (post) {
      dispatch(toggleReadOnly({ url: postUrl, readOnly: !post.read_only }));
    }
  }, [dispatch, post, postUrl]);

  const activeComments = commentsList.filter((c) => !c.delete);

  document.title = "Post Comments | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Post Comments" pageTitle="Posts" />

        <Row>
          <Col lg={12}>
            {/* Post header */}
            <Card>
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <h6 className="mb-1">
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body"
                      >
                        {postUrl}
                        <i className="ri-external-link-line ms-1 text-muted"></i>
                      </a>
                    </h6>
                    <div className="d-flex gap-2">
                      <Badge color="primary-subtle" className="text-primary">
                        <i className="ri-chat-3-line me-1"></i>
                        {activeComments.length} comments
                      </Badge>
                      {post && (
                        <Badge
                          color={post.read_only ? "warning-subtle" : "success-subtle"}
                          className={post.read_only ? "text-warning" : "text-success"}
                          style={{ cursor: "pointer" }}
                          onClick={handleReadOnlyToggle}
                        >
                          <i className={`ri-lock-${post.read_only ? "" : "unlock-"}line me-1`}></i>
                          {post.read_only ? "Locked" : "Open"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Link to="/posts" className="btn btn-sm btn-soft-secondary">
                      <i className="ri-arrow-left-line me-1"></i>Back
                    </Link>
                    <Input
                      type="select"
                      bsSize="sm"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      style={{ width: "auto" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Comments list */}
            {loading ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
              </div>
            ) : commentsList.length > 0 ? (
              commentsList.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postUrl={postUrl}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-4">
                  <i className="ri-chat-3-line display-5 text-muted mb-3 d-block"></i>
                  <h5 className="text-muted">No comments on this post</h5>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostComments;
