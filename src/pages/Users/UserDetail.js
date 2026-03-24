import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
} from "reactstrap";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import CommentCard from "../../Components/Comments/CommentCard";
import DeleteModal from "../../Components/Common/DeleteModal";
import {
  getUserInfo,
  getUserComments,
  blockUser,
  verifyUser,
  deleteUser,
  deleteComment,
  pinComment,
} from "../../helpers/backend_helper";
import { api } from "../../config";

const BLOCK_OPTIONS = [
  { value: "1d", label: "1 day" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "", label: "Permanent" },
];

const UserDetail = () => {
  const { userId } = useParams();
  const decodedUserId = decodeURIComponent(userId);

  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  const [blockModal, setBlockModal] = useState(false);
  const [blockTtl, setBlockTtl] = useState("7d");
  const [deleteAllModal, setDeleteAllModal] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserInfo(api.SITE_ID, decodedUserId);
      setUser(response);
    } catch (err) {
      toast.error("Failed to load user info");
    } finally {
      setLoading(false);
    }
  }, [decodedUserId]);

  const fetchComments = useCallback(async (newSkip = 0) => {
    try {
      setCommentsLoading(true);
      const response = await getUserComments(api.SITE_ID, decodedUserId, pageSize, newSkip);
      const list = response.comments || [];
      setComments(list);
      setHasMore(list.length >= pageSize);
      setSkip(newSkip);
    } catch (err) {
      toast.error("Failed to load user comments");
    } finally {
      setCommentsLoading(false);
    }
  }, [decodedUserId]);

  useEffect(() => {
    fetchUser();
    fetchComments(0);
  }, [fetchUser, fetchComments]);

  const handleBlock = async () => {
    try {
      await blockUser(api.SITE_ID, decodedUserId, true, blockTtl || undefined);
      toast.success(blockTtl ? `User blocked for ${blockTtl}` : "User blocked permanently", { autoClose: 2000 });
      setBlockModal(false);
      fetchUser();
    } catch (err) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblock = async () => {
    try {
      await blockUser(api.SITE_ID, decodedUserId, false);
      toast.success("User unblocked", { autoClose: 2000 });
      fetchUser();
    } catch (err) {
      toast.error("Failed to unblock user");
    }
  };

  const handleVerifyToggle = async () => {
    if (!user) return;
    const newVerified = !user.verified;
    try {
      await verifyUser(api.SITE_ID, decodedUserId, newVerified);
      toast.success(newVerified ? "User verified" : "User unverified", { autoClose: 2000 });
      setUser((prev) => ({ ...prev, verified: newVerified }));
    } catch (err) {
      toast.error("Failed to update verification");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteUser(api.SITE_ID, decodedUserId);
      toast.success("All user comments deleted", { autoClose: 2000 });
      setDeleteAllModal(false);
      setComments([]);
    } catch (err) {
      toast.error("Failed to delete user comments");
    }
  };

  const handleDeleteComment = useCallback(async (id) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    try {
      await deleteComment(api.SITE_ID, id, comment.locator?.url || "");
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, delete: true } : c));
      toast.success("Comment deleted", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  }, [comments]);

  const handleTogglePin = useCallback(async (id, pin) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    try {
      await pinComment(api.SITE_ID, id, comment.locator?.url || "", pin);
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, pin } : c));
      toast.success(pin ? "Comment pinned" : "Comment unpinned", { autoClose: 2000 });
    } catch (err) {
      toast.error("Failed to update pin status");
    }
  }, [comments]);

  document.title = "User Detail | Remark42 Admin";

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
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
        <BreadCrumb title="User Detail" pageTitle="Users" />

        <DeleteModal
          show={deleteAllModal}
          onDeleteClick={handleDeleteAll}
          onCloseClick={() => setDeleteAllModal(false)}
        />

        {/* Block modal */}
        <Modal isOpen={blockModal} toggle={() => setBlockModal(false)} centered>
          <ModalHeader toggle={() => setBlockModal(false)}>
            Block User
          </ModalHeader>
          <ModalBody>
            <p>
              Block <strong>{user?.name || decodedUserId}</strong>?
            </p>
            <Label className="form-label">Duration</Label>
            <Input
              type="select"
              value={blockTtl}
              onChange={(e) => setBlockTtl(e.target.value)}
            >
              {BLOCK_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Input>
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button color="light" onClick={() => setBlockModal(false)}>
                Cancel
              </Button>
              <Button color="danger" onClick={handleBlock}>
                Block
              </Button>
            </div>
          </ModalBody>
        </Modal>

        <Row>
          <Col lg={12}>
            {/* User header card */}
            <Card>
              <CardBody className="p-4">
                <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="rounded-circle"
                        width="56"
                        height="56"
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                        style={{ width: 56, height: 56, fontSize: 24 }}
                      >
                        {(user?.name || decodedUserId)[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h5 className="mb-1">
                        {user?.name || decodedUserId}
                        {user?.verified && (
                          <Badge color="info-subtle" className="text-info ms-2" pill>
                            <i className="ri-check-line me-1"></i>Verified
                          </Badge>
                        )}
                        {user?.blocked && (
                          <Badge color="danger-subtle" className="text-danger ms-2" pill>
                            <i className="ri-forbid-line me-1"></i>Blocked
                          </Badge>
                        )}
                      </h5>
                      <p className="text-muted mb-0 fs-13">{decodedUserId}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <Link to="/users" className="btn btn-sm btn-soft-secondary">
                      <i className="ri-arrow-left-line me-1"></i>Back
                    </Link>
                    <Button
                      color={user?.verified ? "soft-warning" : "soft-info"}
                      size="sm"
                      onClick={handleVerifyToggle}
                    >
                      <i className={`ri-${user?.verified ? "close" : "check"}-line me-1`}></i>
                      {user?.verified ? "Unverify" : "Verify"}
                    </Button>
                    {user?.blocked ? (
                      <Button color="soft-success" size="sm" onClick={handleUnblock}>
                        <i className="ri-lock-unlock-line me-1"></i>Unblock
                      </Button>
                    ) : (
                      <Button color="soft-danger" size="sm" onClick={() => setBlockModal(true)}>
                        <i className="ri-forbid-line me-1"></i>Block
                      </Button>
                    )}
                    <Button
                      color="danger"
                      size="sm"
                      outline
                      onClick={() => setDeleteAllModal(true)}
                    >
                      <i className="ri-delete-bin-line me-1"></i>Delete All Comments
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* User comments */}
            <h5 className="mb-3">Comments</h5>
            {commentsLoading ? (
              <div className="text-center py-4">
                <Spinner color="primary" />
              </div>
            ) : comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    postUrl={comment.locator?.url}
                    showPostUrl
                    onDelete={handleDeleteComment}
                    onTogglePin={handleTogglePin}
                  />
                ))}

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {skip + 1} - {skip + comments.length}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      color="soft-secondary"
                      size="sm"
                      disabled={skip === 0}
                      onClick={() => fetchComments(Math.max(0, skip - pageSize))}
                    >
                      <i className="mdi mdi-chevron-left"></i> Previous
                    </Button>
                    <Button
                      color="soft-secondary"
                      size="sm"
                      disabled={!hasMore}
                      onClick={() => fetchComments(skip + pageSize)}
                    >
                      Next <i className="mdi mdi-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardBody className="text-center py-4">
                  <i className="ri-chat-3-line display-5 text-muted mb-3 d-block"></i>
                  <h5 className="text-muted">No comments from this user</h5>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserDetail;
