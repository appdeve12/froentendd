import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Nav, Card } from 'react-bootstrap';
import { FaPlus, FaTrash, FaBold, FaItalic, FaMinus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { storeMessage } from '../../redux/MessageSlice';

const MessageInput = () => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([{ id: 1, text: '' }]);
  const [activeId, setActiveId] = useState(1);

  const handleAdd = () => {
    const newId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const newMessage = { id: newId, text: '' };
    dispatch(storeMessage([...messages, newMessage]));
    setMessages([...messages, newMessage]);
    setActiveId(newId);
  };

  const handleRemove = (id) => {
    const updated = messages.filter(msg => msg.id !== id);
    dispatch(storeMessage(updated));
    setMessages(updated);
    if (activeId === id && updated.length) {
      setActiveId(updated[0].id);
    }
  };

  const handleTextChange = (id, newText) => {
    const updatedMessages = messages.map(msg =>
      msg.id === id ? { ...msg, text: newText } : msg
    );
    setMessages(updatedMessages);
    dispatch(storeMessage(updatedMessages));
  };

  const formatText = (styleType) => {
    const textarea = document.getElementById('message-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formatted = selectedText;
    if (styleType === 'bold') formatted = `**${selectedText}**`;
    if (styleType === 'italic') formatted = `*${selectedText}*`;

    const updatedText =
      textarea.value.substring(0, start) +
      formatted +
      textarea.value.substring(end);

    handleTextChange(activeId, updatedText);
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
            <>
              <div className="mb-2">
                <Button variant="outline-dark" size="sm" className="me-2" onClick={() => formatText('bold')}>
                  <FaBold /> Bold
                </Button>
                <Button variant="outline-dark" size="sm" onClick={() => formatText('italic')}>
                  <FaItalic /> Italic
                </Button>
              </div>
              <Form.Group>
                <Form.Label className="fw-bold">
                  Message {messages.findIndex(m => m.id === activeId) + 1}
                </Form.Label>
                <Form.Control
                  id="message-textarea"
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
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MessageInput;
