import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Badge,
  Button,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import { fetchBlockedUsers, unblockUser } from "../../slices/users/reducer";

const BlockedUsers = () => {
  const dispatch = useDispatch();

  const selectUsersState = createSelector(
    (state) => state.Users,
    (users) => ({
      blockedUsers: users.blockedUsers,
      loading: users.loading,
    })
  );
  const { blockedUsers, loading } = useSelector(selectUsersState);

  const [unblockModal, setUnblockModal] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

  useEffect(() => {
    dispatch(fetchBlockedUsers());
  }, [dispatch]);

  const handleUnblock = useCallback((user) => {
    setUserToUnblock(user);
    setUnblockModal(true);
  }, []);

  const onUnblockConfirm = () => {
    if (userToUnblock) {
      dispatch(unblockUser(userToUnblock.id));
      setUnblockModal(false);
      setUserToUnblock(null);
    }
  };

  const formatBlockDuration = (user) => {
    if (!user.until || user.until === "0001-01-01T00:00:00Z") {
      return <Badge color="danger-subtle" className="text-danger">Permanent</Badge>;
    }
    const until = moment(user.until);
    if (until.isBefore(moment())) {
      return <Badge color="secondary-subtle" className="text-secondary">Expired</Badge>;
    }
    return (
      <Badge color="warning-subtle" className="text-warning">
        Until {until.fromNow(true)}
      </Badge>
    );
  };

  document.title = "Blocked Users | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Blocked Users" pageTitle="Users" />

        <DeleteModal
          show={unblockModal}
          onDeleteClick={onUnblockConfirm}
          onCloseClick={() => setUnblockModal(false)}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0">
                <h5 className="card-title mb-0">Blocked Users</h5>
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
                            <th scope="col">User</th>
                            <th scope="col" style={{ width: "150px" }}>Duration</th>
                            <th scope="col" style={{ width: "100px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blockedUsers.length > 0 ? (
                            blockedUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <Link
                                    to={`/users/${encodeURIComponent(user.id)}`}
                                    className="fw-medium text-primary"
                                  >
                                    {user.name || user.id}
                                  </Link>
                                  {user.name && (
                                    <span className="text-muted ms-1 fs-13">
                                      ({user.id})
                                    </span>
                                  )}
                                </td>
                                <td>{formatBlockDuration(user)}</td>
                                <td>
                                  <Button
                                    color="soft-success"
                                    size="sm"
                                    onClick={() => handleUnblock(user)}
                                  >
                                    <i className="ri-lock-unlock-line me-1"></i>
                                    Unblock
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="ri-shield-check-line display-5 mb-3 d-block"></i>
                                  <h5>No blocked users</h5>
                                  <p>All users are currently active</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="d-md-none">
                      {blockedUsers.length > 0 ? (
                        blockedUsers.map((user) => (
                          <Card
                            className="border shadow-none mb-2"
                            key={user.id}
                          >
                            <CardBody className="p-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <Link
                                    to={`/users/${encodeURIComponent(user.id)}`}
                                    className="fw-medium text-primary"
                                  >
                                    {user.name || user.id}
                                  </Link>
                                  <div className="mt-1">
                                    {formatBlockDuration(user)}
                                  </div>
                                </div>
                                <Button
                                  color="soft-success"
                                  size="sm"
                                  onClick={() => handleUnblock(user)}
                                >
                                  <i className="ri-lock-unlock-line"></i>
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="ri-shield-check-line display-5 mb-3 d-block"></i>
                          <h5>No blocked users</h5>
                        </div>
                      )}
                    </div>
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

export default BlockedUsers;
