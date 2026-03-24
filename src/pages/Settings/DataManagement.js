import React, { useState, useCallback, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Label,
  Alert,
  Spinner,
  Progress,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { waitForOperation } from "../../helpers/backend_helper";
import { api } from "../../config";

const PROVIDERS = [
  { value: "remark", label: "Remark42" },
  { value: "disqus", label: "Disqus" },
  { value: "wordpress", label: "WordPress" },
  { value: "commento", label: "Commento" },
];

const DataManagement = () => {
  // Export state
  const [exporting, setExporting] = useState(false);

  // Import state
  const [importFile, setImportFile] = useState(null);
  const [provider, setProvider] = useState("remark");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState("");
  const fileInputRef = useRef(null);

  // Read XSRF token for direct axios calls
  const getXsrfToken = () => {
    const xsrf = document.cookie
      .split("; ")
      .find((c) => c.startsWith("XSRF-TOKEN="));
    return xsrf ? xsrf.split("=")[1] : "";
  };

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      const response = await axios.get(
        `/api/v1/admin/export?site=${encodeURIComponent(api.SITE_ID)}&mode=file`,
        {
          responseType: "blob",
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": getXsrfToken() },
        }
      );

      const disposition = response.headers["content-disposition"];
      let filename = `remark42-${api.SITE_ID}-export.json.gz`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export downloaded", { autoClose: 2000 });
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!importFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      setImporting(true);
      setImportProgress("Uploading file...");

      const formData = new FormData();
      formData.append("file", importFile);

      await axios.post(
        `/api/v1/admin/import/form?site=${encodeURIComponent(api.SITE_ID)}&provider=${encodeURIComponent(provider)}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": getXsrfToken(),
          },
        }
      );

      setImportProgress("Processing import...");

      try {
        await waitForOperation(api.SITE_ID, "10m");
        toast.success("Import completed", { autoClose: 3000 });
      } catch (waitErr) {
        toast.warning("Import may still be processing in the background", {
          autoClose: 5000,
        });
      }

      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImportProgress("");
    } catch (err) {
      toast.error("Import failed");
      setImportProgress("");
    } finally {
      setImporting(false);
    }
  }, [importFile, provider]);

  document.title = "Data Management | Remark42 Admin";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Data Management" pageTitle="Settings" />

        <Row>
          {/* Export */}
          <Col lg={6}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-download-2-line me-2"></i>Export
                </h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted">
                  Download all comments as a gzip-compressed JSON file. This can
                  be used as a backup or to migrate to another instance.
                </p>
                <Button
                  color="primary"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-2-line me-1"></i>
                      Export All Comments
                    </>
                  )}
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* Import */}
          <Col lg={6}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-upload-2-line me-2"></i>Import
                </h5>
              </CardHeader>
              <CardBody>
                <Alert color="warning" className="border-0">
                  <i className="ri-alert-line me-2"></i>
                  Importing will add comments to the existing data. Duplicate
                  comments will be skipped.
                </Alert>

                <div className="mb-3">
                  <Label className="form-label">Source Format</Label>
                  <Input
                    type="select"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    disabled={importing}
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </Input>
                </div>

                <div className="mb-3">
                  <Label className="form-label">File</Label>
                  <Input
                    type="file"
                    innerRef={fileInputRef}
                    onChange={(e) => setImportFile(e.target.files[0])}
                    disabled={importing}
                    accept=".json,.json.gz,.gz,.xml"
                  />
                </div>

                {importProgress && (
                  <div className="mb-3">
                    <Progress animated value={100} color="primary" />
                    <small className="text-muted mt-1 d-block">
                      {importProgress}
                    </small>
                  </div>
                )}

                <Button
                  color="primary"
                  onClick={handleImport}
                  disabled={importing || !importFile}
                >
                  {importing ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-2-line me-1"></i>
                      Import Comments
                    </>
                  )}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DataManagement;
