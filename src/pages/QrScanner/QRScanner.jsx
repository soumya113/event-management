import { useEffect, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";
import QRResult from "./QRResult";

const QRScanner = () => {
  const scannerRef = useRef(null);

  const [manualQr, setManualQr] = useState("");

  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(false);

  const verifyQRCode = async (qrCode) => {
    try {
      setLoading(true);

      const response = await apiService.get(
        apiPath.VERIFY_QR(qrCode)
      );

      setCustomer(response);

      toast.success("Customer Verified");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid QR"
      );

      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        verifyQRCode(decodedText);

        scanner.clear();
      },
      () => {}
    );

    scannerRef.current = scanner;

    return () => {
      scanner
        .clear()
        .catch(() => {});
    };
  }, []);

  return (
    <Row>
      <Col lg={6}>
        <Card>
          <Card.Header>
            Scan QR Code
          </Card.Header>

          <Card.Body>
            <div id="reader"></div>

            <hr />

            <Form.Group>
              <Form.Label>
                Manual QR Entry
              </Form.Label>

              <Form.Control
                value={manualQr}
                placeholder="Enter QR Code"
                onChange={(e) =>
                  setManualQr(e.target.value)
                }
              />
            </Form.Group>

            <Button
              className="mt-3"
              onClick={() =>
                verifyQRCode(manualQr)
              }
              disabled={loading}
            >
              Verify
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6}>
        <QRResult
          customer={customer}
          onSuccess={() => setCustomer(null)}
        />
      </Col>
    </Row>
  );
};

export default QRScanner;