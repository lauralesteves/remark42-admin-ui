import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import CommentCard from "../../Components/Comments/CommentCard";
import {
  getPostsList,
  getLastComments,
  deleteComment,
  pinComment,
} from "../../helpers/backend_helper";
import { api } from "../../config";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [commentsToday, setCommentsToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const since24h = moment().subtract(24, "hours").valueOf();

      const [postsRes, recentRes, todayRes] = await Promise.all([
        getPostsList(api.SITE_ID, 5, 0),
        getLastComments(api.SITE_ID, 10),
        getLastComments(api.SITE_ID, 100, since24h),
      ]);

      setPosts(postsRes || []);
      setRecentComments(recentRes.comments || recentRes || []);

      const todayList = todayRes.comments || todayRes || [];
      setCommentsToday(Array.isArray(todayList) ? todayList.length : 0);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async (id) => {
    const comment = recentComments.find((c) => c.id === id);
    if (!comment) return;
    try {
      await deleteComment(api.SITE_ID, id, comment.locator?.url || "");
      setRecentComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, delete: true } : c))
      );
      toast.success("Comment deleted", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  }, [recentComments]);

  const handleTogglePin = useCallback(async (id, pin) => {
    const comment = recentComments.find((c) => c.id === id);
    if (!comment) return;
    try {
      await pinComment(api.SITE_ID, id, comment.locator?.url || "", pin);
      setRecentComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, pin } : c))
      );
      toast.success(pin ? "Comment pinned" : "Comment unpinned", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to update pin status");
    }
  }, [recentComments]);

  const truncateUrl = (url, maxLen = 50) => {
    if (!url) return "-";
    try {
      const parsed = new URL(url);
      const path = parsed.pathname;
      return path.length > maxLen ? path.substring(0, maxLen) + "..." : path;
    } catch {
      return url.length > maxLen ? url.substring(0, maxLen) + "..." : url;
    }
  };

  document.title = "Dashboard | Remark42 Admin";

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Remark42" />
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Dashboard" pageTitle="Remark42" />

        {/* Stats row */}
        <Row>
          <Col md={6} xl={3}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="fw-medium text-muted mb-0">Total Posts</p>
                    <h2 className="mt-4 ff-secondary fw-semibold">
                      {posts.length}
                    </h2>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                      <i className="ri-article-line"></i>
                    </span>
                  </div>
                </div>
                <Link to="/posts" className="text-decoration-none text-muted">
                  View all posts <i className="ri-arrow-right-s-line"></i>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} xl={3}>
            <Card className="card-animate">
              <CardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="fw-medium text-muted mb-0">Comments (24h)</p>
                    <h2 className="mt-4 ff-secondary fw-semibold">
                      {commentsToday}
                    </h2>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                      <i className="ri-chat-3-line"></i>
                    </span>
                  </div>
                </div>
                <Link to="/comments" className="text-decoration-none text-muted">
                  View all comments <i className="ri-arrow-right-s-line"></i>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Recent comments */}
          <Col xl={7}>
            <Card>
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Comments</h5>
                <Link to="/comments" className="btn btn-sm btn-soft-primary">
                  View All
                </Link>
              </CardHeader>
              <CardBody>
                {recentComments.length > 0 ? (
                  recentComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      postUrl={comment.locator?.url}
                      showPostUrl
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="ri-chat-3-line display-5 mb-3 d-block"></i>
                    <h5>No comments yet</h5>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* Top posts */}
          <Col xl={5}>
            <Card>
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Top Posts</h5>
                <Link to="/posts" className="btn btn-sm btn-soft-primary">
                  View All
                </Link>
              </CardHeader>
              <CardBody>
                {posts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      <tbody>
                        {posts.map((post, index) => (
                          <tr key={post.url || index}>
                            <td>
                              <Link
                                to={`/posts/${encodeURIComponent(post.url)}`}
                                className="text-body"
                                title={post.url}
                              >
                                {truncateUrl(post.url)}
                              </Link>
                            </td>
                            <td className="text-end">
                              <Badge
                                color="primary-subtle"
                                className="text-primary"
                              >
                                {post.count}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="ri-article-line display-5 mb-3 d-block"></i>
                    <h5>No posts yet</h5>
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

export default Dashboard;
