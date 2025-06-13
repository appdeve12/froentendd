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
import { useDispatch } from 'react-redux';
import { storeSessions } from '../../redux/authSlice';
import { useSelector } from 'react-redux';

const socket = io('http://16.171.165.95');

const QRCodeLogin = () => {
  const session = useSelector(state => state.auth.sessions);
  console.log(session)
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startNewSession = async () => {
    try {
      const res = await axios.post('http://16.171.165.95/start-session');
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
            s.sessionId === sessionId ? { ...s, qr: qrUrl, status: '📷 Scan QR from WhatsApp' } : s
          );

          dispatch(storeSessions([]));
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

  const selected = sessions.find((s) => s.sessionId === activeSession);
  console.log("selected", selected)
  return (
    <Container fluid className="vh-100 whatsapp-container bg-light position-relative">
      <Row className="h-100">
        <Col md={3} className="border-end bg-white shadow-sm p-0">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-success text-white">
            <h5 className="mb-0">📱 Sessions</h5>
            <Button size="sm" variant="light" onClick={startNewSession}>
              ➕
            </Button>
          </div>

          <ListGroup variant="flush" className="session-list">
            {sessions.map((s) => (
              <ListGroup.Item
                key={s.sessionId}
                action
                active={activeSession === s.sessionId}
                onClick={() => setActiveSession(s.sessionId)}
                className="d-flex flex-column"
              >
                <strong className="text-truncate">ID: {s.sessionId.slice(0, 8)}</strong>
                <small className={s.realNumber ? 'text-success' : 'text-muted'}>
                  {s.realNumber || s.status}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9} className="d-flex justify-content-center align-items-center">
          {selected ? (
            <Card className="p-4 shadow rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
              <h5 className="text-center mb-4">
                🟢 Session: <strong>{selected.sessionId.slice(0, 8)}</strong>
              </h5>

              {selected.qr ? (
                <div className="text-center">
                  <Image src={selected.qr} fluid className="border rounded-3" />
                  <p className="mt-2 text-muted">Scan QR using WhatsApp</p>
                </div>
              ) : selected.realNumber ? (
                <Alert variant="success" className="text-center">
                  {selected.status}
                </Alert>
              ) : (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Waiting for QR code...</p>
                </div>
              )}

              {selected.realNumber && (
                <div className="mt-3 text-center">
                  <strong className="text-success">📞 {selected.realNumber}</strong>
                </div>
              )}
            </Card>
          ) : (
            <p className="text-muted fs-5">Select or start a session to view QR code.</p>
          )}
        </Col>
      </Row>

      {selected && (
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
