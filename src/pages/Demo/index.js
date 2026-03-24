import React, { useEffect, useState, useCallback } from "react";
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
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  getCommentsByPost,
  createComment,
} from "../../helpers/backend_helper";
import { api } from "../../config";

const DemoComment = ({ comment, depth = 0, onReply }) => {
  const user = comment.user || {};
  const maxDepth = 4;

  return (
    <div style={{ marginLeft: Math.min(depth, maxDepth) * 24 }}>
      <div className="d-flex gap-2 mb-3">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="rounded-circle flex-shrink-0"
            width="36"
            height="36"
          />
        ) : (
          <div
            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36, fontSize: 14 }}
          >
            {(user.name || "?")[0].toUpperCase()}
          </div>
        )}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-medium">{user.name || "Anonymous"}</span>
            <span className="text-muted fs-13">
              {moment(comment.time).fromNow()}
            </span>
            {comment.score !== 0 && (
              <span
                className={`fs-13 ${comment.score > 0 ? "text-success" : "text-danger"}`}
              >
                {comment.score > 0 ? "+" : ""}
                {comment.score}
              </span>
            )}
          </div>
          {comment.delete ? (
            <p className="text-muted fst-italic mb-1">
              Comment deleted.
            </p>
          ) : (
            <div
              className="mb-1"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
          )}
          {!comment.delete && (
            <button
              className="btn btn-link btn-sm p-0 text-muted"
              onClick={() => onReply(comment.id)}
            >
              <i className="ri-reply-line me-1"></i>Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  const [postUrl, setPostUrl] = useState(window.location.origin + "/demo");
  const [inputUrl, setInputUrl] = useState(postUrl);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCommentsByPost(
        api.SITE_ID,
        postUrl,
        "-time",
        "plain"
      );
      setComments(response.comments || []);
    } catch (err) {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postUrl]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLoadUrl = (e) => {
    e.preventDefault();
    setPostUrl(inputUrl);
    setReplyTo(null);
    setNewComment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await createComment(api.SITE_ID, postUrl, newComment, replyTo);
      setNewComment("");
      setReplyTo(null);
      toast.success("Comment posted", { autoClose: 2000 });
      fetchComments();
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    document.getElementById("demo-comment-input")?.focus();
  };

  const replyingToComment = replyTo
    ? comments.find((c) => c.id === replyTo)
    : null;

  document.title = "Demo | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Demo" pageTitle="Remark42" />

        <Row>
          <Col lg={8} className="mx-auto">
            {/* URL selector */}
            <Card>
              <CardHeader className="border-0">
                <h5 className="card-title mb-0">Comment Widget Preview</h5>
                <p className="text-muted mt-2 mb-0">
                  Preview and interact with comments for any post URL.
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleLoadUrl}>
                  <InputGroup>
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
              </CardBody>
            </Card>

            {/* Comment form */}
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  {replyTo && (
                    <div className="alert alert-light border py-2 px-3 d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted fs-13">
                        <i className="ri-reply-line me-1"></i>
                        Replying to{" "}
                        <strong>
                          {replyingToComment?.user?.name || "comment"}
                        </strong>
                      </span>
                      <button
                        type="button"
                        className="btn-close btn-close-sm"
                        onClick={() => setReplyTo(null)}
                      ></button>
                    </div>
                  )}
                  <InputGroup>
                    <Input
                      id="demo-comment-input"
                      type="textarea"
                      rows="2"
                      placeholder="Write a comment... (Markdown supported)"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={submitting}
                    />
                    <Button
                      color="primary"
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                    >
                      {submitting ? (
                        <Spinner size="sm" />
                      ) : (
                        <i className="ri-send-plane-fill"></i>
                      )}
                    </Button>
                  </InputGroup>
                </form>
              </CardBody>
            </Card>

            {/* Comments list */}
            <Card>
              <CardHeader className="border-0">
                <h6 className="card-title mb-0">
                  {loading
                    ? "Loading..."
                    : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
                </h6>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner color="primary" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <DemoComment
                      key={comment.id}
                      comment={comment}
                      depth={0}
                      onReply={handleReply}
                    />
                  ))
                ) : (
                  <div className="text-center py-3 text-muted">
                    <i className="ri-chat-3-line display-5 mb-3 d-block"></i>
                    <p>No comments yet. Be the first!</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Demo;
