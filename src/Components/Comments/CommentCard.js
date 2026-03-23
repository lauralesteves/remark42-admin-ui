import React, { useState } from "react";
import {
  Card,
  CardBody,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import DeleteModal from "../Common/DeleteModal";

const CommentCard = ({ comment, postUrl, onDelete, onTogglePin, showPostUrl }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const user = comment.user || {};
  const isDeleted = comment.delete;

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => {
          onDelete(comment.id);
          setDeleteModal(false);
        }}
        onCloseClick={() => setDeleteModal(false)}
      />

      <Card className={`border shadow-none mb-2 ${isDeleted ? "opacity-50" : ""}`}>
        <CardBody className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
              ) : (
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{ width: 32, height: 32, fontSize: 14 }}
                >
                  {(user.name || "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <Link
                  to={`/users/${encodeURIComponent(user.id)}`}
                  className="fw-medium text-body"
                >
                  {user.name || "Anonymous"}
                </Link>
                {user.verified && (
                  <Badge
                    color="info-subtle"
                    className="text-info ms-1"
                    pill
                  >
                    <i className="ri-check-line"></i>
                  </Badge>
                )}
                <div className="text-muted fs-13">
                  {moment(comment.time).fromNow()}
                  {comment.edit && (
                    <span className="ms-1">(edited)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {comment.pin && (
                <Badge color="warning-subtle" className="text-warning">
                  <i className="ri-pushpin-line"></i> Pinned
                </Badge>
              )}
              {comment.score !== 0 && (
                <Badge
                  color={comment.score > 0 ? "success-subtle" : "danger-subtle"}
                  className={comment.score > 0 ? "text-success" : "text-danger"}
                >
                  {comment.score > 0 ? "+" : ""}
                  {comment.score}
                </Badge>
              )}
              {!isDeleted && (
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="button"
                    className="btn btn-soft-secondary btn-sm btn-icon"
                  >
                    <i className="ri-more-2-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      onClick={() =>
                        onTogglePin(comment.id, !comment.pin)
                      }
                    >
                      <i
                        className={`ri-pushpin-${comment.pin ? "fill" : "line"} align-bottom me-2 text-muted`}
                      ></i>
                      {comment.pin ? "Unpin" : "Pin"}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      className="text-danger"
                      onClick={() => setDeleteModal(true)}
                    >
                      <i className="ri-delete-bin-line align-bottom me-2"></i>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </div>
          </div>

          {showPostUrl && postUrl && (
            <div className="mb-2">
              <Link
                to={`/posts/${encodeURIComponent(postUrl)}`}
                className="text-muted fs-13"
              >
                <i className="ri-link me-1"></i>
                {postUrl}
              </Link>
            </div>
          )}

          {isDeleted ? (
            <p className="text-muted fst-italic mb-0">
              This comment has been deleted.
            </p>
          ) : (
            <div
              className="comment-text mb-0"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default CommentCard;
