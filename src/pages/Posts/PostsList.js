import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getPosts, toggleReadOnly } from "../../slices/posts/reducer";

const PostsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectPostsState = createSelector(
    (state) => state.Posts,
    (posts) => ({
      postsList: posts.posts,
      loading: posts.loading,
    })
  );
  const { postsList, loading } = useSelector(selectPostsState);

  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    dispatch(getPosts({ limit: pageSize, skip: currentPage * pageSize }));
  }, [dispatch, currentPage]);

  const filteredPosts = postsList.filter((post) =>
    searchInput
      ? post.url.toLowerCase().includes(searchInput.toLowerCase())
      : true
  );

  const handleReadOnlyToggle = useCallback(
    (post) => {
      dispatch(toggleReadOnly({ url: post.url, readOnly: !post.read_only }));
    },
    [dispatch]
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return moment(dateStr).fromNow();
  };

  const truncateUrl = (url, maxLen = 60) => {
    if (!url) return "-";
    try {
      const parsed = new URL(url);
      const path = parsed.pathname;
      if (path.length <= maxLen) return path;
      return path.substring(0, maxLen) + "...";
    } catch {
      return url.length > maxLen ? url.substring(0, maxLen) + "..." : url;
    }
  };

  document.title = "Posts | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Posts" pageTitle="Remark42" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <h5 className="card-title mb-0 flex-grow-1">
                    All Posts
                  </h5>
                  <div style={{ minWidth: "280px" }}>
                    <Input
                      type="text"
                      placeholder="Filter by URL..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="table-responsive d-none d-md-block">
                      <table className="table align-middle table-nowrap table-striped-columns mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">URL</th>
                            <th scope="col" style={{ width: "100px" }}>
                              Comments
                            </th>
                            <th scope="col" style={{ width: "160px" }}>
                              Last Comment
                            </th>
                            <th scope="col" style={{ width: "100px" }}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                              <tr key={post.url || index}>
                                <td>
                                  <span
                                    className="fw-medium text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate(
                                        `/posts/${encodeURIComponent(post.url)}`
                                      )
                                    }
                                    title={post.url}
                                  >
                                    {truncateUrl(post.url)}
                                  </span>
                                </td>
                                <td>
                                  <Badge
                                    color="primary-subtle"
                                    className="text-primary"
                                  >
                                    {post.count}
                                  </Badge>
                                </td>
                                <td className="text-muted">
                                  {formatDate(post.last_time)}
                                </td>
                                <td>
                                  {post.read_only ? (
                                    <Badge
                                      color="warning-subtle"
                                      className="text-warning"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleReadOnlyToggle(post)
                                      }
                                      title="Click to unlock"
                                    >
                                      <i className="ri-lock-line me-1"></i>
                                      Locked
                                    </Badge>
                                  ) : (
                                    <Badge
                                      color="success-subtle"
                                      className="text-success"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleReadOnlyToggle(post)
                                      }
                                      title="Click to lock"
                                    >
                                      <i className="ri-lock-unlock-line me-1"></i>
                                      Open
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="ri-article-line display-5 mb-3 d-block"></i>
                                  <h5>No posts found</h5>
                                  {searchInput ? (
                                    <p>
                                      No results for "
                                      <strong>{searchInput}</strong>"
                                    </p>
                                  ) : (
                                    <p>
                                      No posts with comments yet
                                    </p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="d-md-none">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                          <Card
                            className="border shadow-none mb-2"
                            key={post.url || index}
                          >
                            <CardBody className="p-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div
                                  className="flex-grow-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    navigate(
                                      `/posts/${encodeURIComponent(post.url)}`
                                    )
                                  }
                                >
                                  <h6 className="mb-1 text-primary">
                                    {truncateUrl(post.url, 40)}
                                  </h6>
                                  <div className="d-flex gap-2 text-muted fs-13">
                                    <span>
                                      <i className="ri-chat-3-line me-1"></i>
                                      {post.count}
                                    </span>
                                    <span>{formatDate(post.last_time)}</span>
                                  </div>
                                </div>
                                {post.read_only ? (
                                  <Badge
                                    color="warning-subtle"
                                    className="text-warning"
                                    onClick={() =>
                                      handleReadOnlyToggle(post)
                                    }
                                  >
                                    <i className="ri-lock-line"></i>
                                  </Badge>
                                ) : (
                                  <Badge
                                    color="success-subtle"
                                    className="text-success"
                                    onClick={() =>
                                      handleReadOnlyToggle(post)
                                    }
                                  >
                                    <i className="ri-lock-unlock-line"></i>
                                  </Badge>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="ri-article-line display-5 mb-3 d-block"></i>
                          <h5>No posts found</h5>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {postsList.length >= pageSize && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted">
                          Page {currentPage + 1}
                        </div>
                        <ul className="pagination pagination-separated mb-0">
                          <li
                            className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(currentPage - 1)
                              }
                              disabled={currentPage === 0}
                            >
                              <i className="mdi mdi-chevron-left"></i>
                            </button>
                          </li>
                          <li className="page-item active">
                            <span className="page-link">
                              {currentPage + 1}
                            </span>
                          </li>
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() =>
                                setCurrentPage(currentPage + 1)
                              }
                            >
                              <i className="mdi mdi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostsList;
