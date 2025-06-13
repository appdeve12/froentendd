import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Nav, Card } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { storeMessage } from '../../redux/MessageSlice';
import { FaMinus } from "react-icons/fa";
const MessageInput = () => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([{ id: 1, text: '' }]);
  const [activeId, setActiveId] = useState(1);

  const handleAdd = () => {
    const newId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const newMessage = { id: newId, text: '' };
    dispatch(storeMessage([...messages, newMessage]))
    setMessages([...messages, newMessage]);
    setActiveId(newId);
  };

  const handleRemove = (id) => {
    const updated = messages.filter(msg => msg.id !== id);
    dispatch(storeMessage(updated))
    setMessages(updated);
    if (activeId === id && updated.length) {
      setActiveId(updated[0].id);
    }
  };

  const handleTextChange = (id, newText) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, text: newText } : msg
    ));
    dispatch(storeMessage(messages.map(msg =>
      msg.id === id ? { ...msg, text: newText } : msg
    )))
  };

  const activeMessage = messages.find(msg => msg.id === activeId);

  return (
    <Container className="p-2">
      <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <Nav variant="tabs">
                {messages.map((msg, index) => (
                  <Nav.Item key={msg.id}>
                    <Nav.Link
                      active={msg.id === activeId}
                      onClick={() => setActiveId(msg.id)}
                    >
                      Message {index + 1}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col xs="auto">
              <Button variant="success" size="sm" onClick={handleAdd} className="me-2" title="Add">
                <FaPlus />
              </Button>
              {messages.length > 1 && (
                <Button variant="danger" size="sm" onClick={() => handleRemove(activeId)} title="Remove">
                  <FaMinus />
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {activeMessage && (
            <Form.Group>
              <Form.Label className="fw-bold">
                Message {messages.findIndex(m => m.id === activeId) + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  resize: 'none',
                }}
                value={activeMessage.text}
                onChange={(e) => handleTextChange(activeId, e.target.value)}
              />
            </Form.Group>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MessageInput;
