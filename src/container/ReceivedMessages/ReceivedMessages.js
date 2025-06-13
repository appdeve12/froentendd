import React, { useState } from 'react';
import { Table, Modal, Button, ListGroup, Container, Row, Col,Card } from 'react-bootstrap';

const ReceivedMessages = () => {
  const data = [
    { name: 'John Doe', number: '+1234567890', var1: 'Hey, how are you doing today?' },
    { name: 'Jane Smith', number: '+9876543210', var1: 'Meeting at 3 PM, don’t forget!' },
    { name: 'Alice Johnson', number: '+1122334455', var1: 'Happy Birthday! 🎉' },
    { name: 'Bob Brown', number: '+9988776655', var1: 'Can you send the files?' },
    { name: 'Charlie Davis', number: '+4433221100', var1: 'See you soon!' },
  ];

  const [show, setShow] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleShow = (item) => {
    setSelectedMessage(item);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <Container className="">
            <Card className="mb-3 shadow-sm border-0">

       <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center"style={{ padding: "0.5rem 1.5rem" }}>
                <strong>📩 Received Messages</strong>
             
              </Card.Header>
   

      <ListGroup style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {data.map((item, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => handleShow(item)}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-bold">{item.name}</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{item.var1.slice(0, 30)}...</div>
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{item.number}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>

    
<div
  className="d-flex justify-content-between align-items-center px-4 py-2 text-white bg-success"
  style={{
    position: 'fixed',
    bottom: 0,
  
    width: '30vw',

    fontWeight: '500',
    boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.15)',
   
  }}
>
 <small>Total: {data.length}</small>
        <small>Unread: {data.length}</small>
        <small>Groups: 0</small>
</div>
</Card>


      {/* Modal for full message view */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>📨 Message from {selectedMessage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <p><strong>Number:</strong> {selectedMessage?.number}</p>
              <p><strong>Message:</strong> {selectedMessage?.var1}</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReceivedMessages;
