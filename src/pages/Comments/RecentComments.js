import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Input,
  Button,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import CommentCard from "../../Components/Comments/CommentCard";
import {
  getLastComments,
  deleteComment,
  pinComment,
} from "../../helpers/backend_helper";
import { api } from "../../config";

const TIME_FILTERS = [
  { value: "", label: "All time" },
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
];

const LIMIT_OPTIONS = [25, 50, 100];

const RecentComments = () => {
  const dispatch = useDispatch();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(25);
  const [timeFilter, setTimeFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const getSinceTimestamp = useCallback((filter) => {
    if (!filter) return null;
    const now = moment();
    switch (filter) {
      case "1h":
        return now.subtract(1, "hours").valueOf();
      case "24h":
        return now.subtract(24, "hours").valueOf();
      case "7d":
        return now.subtract(7, "days").valueOf();
      default:
        return null;
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const since = getSinceTimestamp(timeFilter);
      const response = await getLastComments(api.SITE_ID, limit, since);
      setComments(response.comments || response || []);
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [limit, timeFilter, getSinceTimestamp]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchComments, 30000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchComments]);

  const handleDelete = useCallback(
    async (id) => {
      const comment = comments.find((c) => c.id === id);
      if (!comment) return;
      const postUrl = comment.locator?.url || "";
      try {
        await deleteComment(api.SITE_ID, id, postUrl);
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, delete: true } : c))
        );
        toast.success("Comment deleted", { autoClose: 2000 });
      } catch (err) {
        toast.error("Failed to delete comment");
      }
    },
    [comments]
  );

  const handleTogglePin = useCallback(
    async (id, pin) => {
      const comment = comments.find((c) => c.id === id);
      if (!comment) return;
      const postUrl = comment.locator?.url || "";
      try {
        await pinComment(api.SITE_ID, id, postUrl, pin);
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, pin } : c))
        );
        toast.success(pin ? "Comment pinned" : "Comment unpinned", {
          autoClose: 2000,
        });
      } catch (err) {
        toast.error("Failed to update pin status");
      }
    },
    [comments]
  );

  document.title = "Recent Comments | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Recent Comments" pageTitle="Remark42" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <h5 className="card-title mb-0 flex-grow-1">
                    Recent Comments
                  </h5>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <Input
                      type="select"
                      bsSize="sm"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      style={{ width: "auto" }}
                    >
                      {TIME_FILTERS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Input>
                    <Input
                      type="select"
                      bsSize="sm"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      style={{ width: "auto" }}
                    >
                      {LIMIT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n} comments
                        </option>
                      ))}
                    </Input>
                    <Button
                      color={autoRefresh ? "primary" : "soft-secondary"}
                      size="sm"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      title={
                        autoRefresh
                          ? "Auto-refresh ON (30s)"
                          : "Auto-refresh OFF"
                      }
                    >
                      <i
                        className={`ri-refresh-line ${autoRefresh ? "ri-loader-4-line" : ""}`}
                      ></i>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
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
                  <div className="text-center py-4">
                    <i className="ri-chat-3-line display-5 text-muted mb-3 d-block"></i>
                    <h5 className="text-muted">No recent comments</h5>
                    {timeFilter && (
                      <p className="text-muted">
                        Try a wider time range
                      </p>
                    )}
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

export default RecentComments;
