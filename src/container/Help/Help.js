import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';

const Help = () => {
  return (
    <Container className="">
      <Card className="" style={{ width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">Need Help?</h2>
            <p className="text-muted">We're just a call away. Reach out to us anytime!</p>
          </div>

          <Row className="text-center">
            <Col xs={12} md={6} className="mb-3">
              <Card className="border-0 bg-info text-white rounded-3">
                <Card.Body>
             
                  <p>
                    📞 <a href="tel:+918826132172" className="text-white text-decoration-none">+91 8826132172</a>
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <Card className="border-0 bg-success text-white rounded-3">
                <Card.Body>
           
                  <p>
                    📞 <a href="tel:+919319312172" className="text-white text-decoration-none">+91 9319312172</a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

      
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Help;
