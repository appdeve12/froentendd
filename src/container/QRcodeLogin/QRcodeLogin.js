import '../../assets/css/WhatsappUI.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Image,
  Alert,
  Spinner,
  Card,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeSessions } from '../../redux/authSlice';

const socket = io('http://13.53.41.83');

const QRCodeLogin = () => {
  const reduxSessions = useSelector(state => state.auth.sessions);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startNewSession = async () => {
    try {
      const res = await axios.post('http://13.53.41.83/start-session');
      const sessionId = res.data.sessionId;

      const newSession = {
        sessionId,
        qr: null,
        realNumber: '',
        status: 'Initializing...',
      };

      setSessions((prev) => {
        const updatedSessions = [...prev, newSession];
        if (updatedSessions.length === 1) {
          setActiveSession(sessionId);
        }
        return updatedSessions;
      });

      socket.on(`qr-${sessionId}`, (qrUrl) => {
        setSessions((prev) => {
          const updated = prev.map((s) =>
            s.sessionId === sessionId
              ? { ...s, qr: qrUrl, status: '📷 Scan QR from WhatsApp' }
              : s
          );
          dispatch(storeSessions(updated));
          return updated;
        });
      });

      socket.on(`ready-${sessionId}`, (data) => {
        setSessions((prev) => {
          const updated = prev.map((s) =>
            s.sessionId === sessionId
              ? {
                  ...s,
                  qr: null,
                  realNumber: data.number,
                  status: `✅ Logged in as ${data.number}`,
                }
              : s
          );
          dispatch(storeSessions(updated));
          return updated;
        });
      });
    } catch (error) {
      console.error('Failed to start session:', error.message);
    }
  };

  useEffect(() => {
    if (sessions.length === 0) {
      startNewSession();
    }
  }, []);

  const helpcontact = () => {
    navigate("/help");
  };

  const backlogin = () => {
    navigate("/");
  };

  const selected = sessions.find((s) => s.sessionId === activeSession);

  return (
    <Container fluid className="vh-100 whatsapp-container bg-light position-relative">
      <Row className="h-100">
        {/* Sidebar */}
        <Col md={3} className="border-end bg-white shadow-sm p-0">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-success text-white">
            <h5 className="mb-0">📱 Sessions</h5>
            <Button size="sm" variant="light" onClick={startNewSession}>
              ➕
            </Button>
          </div>

          <ListGroup variant="flush" className="session-list bg-success">
            {sessions.map((s) => (
              <ListGroup.Item
                key={s.sessionId}
                action
                active={activeSession === s.sessionId}
                onClick={() => setActiveSession(s.sessionId)}
                className="d-flex flex-column bg-success"
              >
                <strong className="text-truncate">ID: {s.sessionId.slice(0, 8)}</strong>
                <small className={s.realNumber ? 'text-success' : 'text-muted'}>
                  {s.realNumber || s.status}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col md={9} className="d-flex justify-content-center align-items-center bg-light">
          {selected ? (
            <Card className="p-4 shadow rounded-4" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}>
              <h4 className="text-center mb-4 text-success">Log into WhatsApp Web</h4>
              <Row>
                {/* Instructions */}
                <Col md={6} className="pe-4 border-end">
                  <ul className="list-unstyled small">
                    <li><strong>1.</strong> Open WhatsApp on your phone</li>
                    <li><strong>2.</strong> Tap <strong>Menu</strong> <span className="text-muted">(⋮)</span> on Android or <strong>Settings</strong> on iPhone</li>
                    <li><strong>3.</strong> Tap <strong>Linked devices</strong> & then <strong>Link a device</strong></li>
                    <li><strong>4.</strong> Point your phone at this screen to scan the QR code</li>
                  </ul>
                  <div onClick={helpcontact} className="d-block small text-decoration-none mt-3">Need help getting started?</div>
                  <div onClick={backlogin} className="d-block small text-decoration-none mt-3">Back To The Login Page?</div>
                </Col>

                {/* QR Code or Status Display */}
                <Col md={6} className="text-center">
               {selected.status === 'Initializing...' ? (
  <div className="text-center">
    <Spinner animation="border" variant="success" />
    <p className="mt-2 text-muted">Initializing session...</p>
  </div>
) : selected.qr ? (
  <div>
    <Image src={selected.qr} fluid className="border rounded-3" />
    <p className="mt-2 text-muted">📷 Scan QR from WhatsApp</p>
  </div>
) : !selected.qr && !selected.realNumber ? (
  <div className="text-center">
    <Spinner animation="grow" variant="success" />
    <p className="mt-2 text-muted">Please wait... Logging in</p>
  </div>
) : selected.realNumber ? (
  <Alert variant="success" className="text-center">
    ✅ Logged in as <strong>{selected.realNumber}</strong>
  </Alert>
) : null}

                </Col>
              </Row>
            </Card>
          ) : (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading session...</p>
            </div>
          )}
        </Col>
      </Row>

      {selected && selected.realNumber && (
        <Row className="bg-white border-top p-3 position-fixed bottom-0 w-100 m-0">
          <Col className="text-end">
            <Button variant="primary" onClick={() => navigate('/home')}>
              🚀 Move to Dashboard
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default QRCodeLogin;
