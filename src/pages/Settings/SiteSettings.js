import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getConfig } from "../../helpers/backend_helper";
import { api } from "../../config";

const InfoRow = ({ label, value }) => (
  <tr>
    <td className="fw-medium text-muted" style={{ width: "40%" }}>
      {label}
    </td>
    <td>{value}</td>
  </tr>
);

const SiteSettings = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConfig(api.SITE_ID);
      setConfig(response);
    } catch (err) {
      toast.error("Failed to load site configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const formatDuration = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  document.title = "Settings | Remark42 Admin";

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Settings" pageTitle="Remark42" />
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
        <BreadCrumb title="Settings" pageTitle="Remark42" />

        <Alert color="info" className="border-0">
          <i className="ri-information-line me-2"></i>
          These settings are read-only. Configuration changes require updating
          environment variables and restarting the Remark42 server.
        </Alert>

        <Row>
          {/* General */}
          <Col lg={6}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-settings-3-line me-2"></i>General
                </h5>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <tbody>
                      <InfoRow
                        label="Version"
                        value={config?.version || "-"}
                      />
                      <InfoRow
                        label="Max Comment Size"
                        value={
                          config?.max_comment_size
                            ? `${config.max_comment_size} chars`
                            : "-"
                        }
                      />
                      <InfoRow
                        label="Edit Duration"
                        value={formatDuration(config?.edit_duration)}
                      />
                      <InfoRow
                        label="Low Score Threshold"
                        value={config?.low_score ?? "-"}
                      />
                      <InfoRow
                        label="Critical Score Threshold"
                        value={config?.critical_score ?? "-"}
                      />
                      <InfoRow
                        label="Positive Score"
                        value={config?.positive_score ? "Yes" : "No"}
                      />
                      <InfoRow
                        label="Read-Only Age"
                        value={
                          config?.readonly_age
                            ? formatDuration(config.readonly_age)
                            : "Disabled"
                        }
                      />
                      <InfoRow
                        label="Emoji Enabled"
                        value={config?.emoji_enabled ? "Yes" : "No"}
                      />
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Auth Providers */}
          <Col lg={6}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-shield-keyhole-line me-2"></i>Auth Providers
                </h5>
              </CardHeader>
              <CardBody>
                {config?.auth_providers && config.auth_providers.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {config.auth_providers.map((provider) => (
                      <Badge
                        key={provider}
                        color="primary-subtle"
                        className="text-primary fs-13 px-3 py-2"
                      >
                        {provider}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No auth providers configured</p>
                )}
              </CardBody>
            </Card>

            {/* Admin Emails */}
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-admin-line me-2"></i>Admins
                </h5>
              </CardHeader>
              <CardBody>
                {config?.admin_email ? (
                  <span className="text-body">{config.admin_email}</span>
                ) : (
                  <p className="text-muted mb-0">No admin email configured</p>
                )}
              </CardBody>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-notification-3-line me-2"></i>Notifications
                </h5>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <tbody>
                      <InfoRow
                        label="Email Notifications"
                        value={
                          config?.email_notifications ? (
                            <Badge color="success-subtle" className="text-success">Enabled</Badge>
                          ) : (
                            <Badge color="secondary-subtle" className="text-secondary">Disabled</Badge>
                          )
                        }
                      />
                      <InfoRow
                        label="Telegram Notifications"
                        value={
                          config?.telegram_notifications ? (
                            <Badge color="success-subtle" className="text-success">Enabled</Badge>
                          ) : (
                            <Badge color="secondary-subtle" className="text-secondary">Disabled</Badge>
                          )
                        }
                      />
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SiteSettings;
