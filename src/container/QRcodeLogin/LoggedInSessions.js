import React from 'react';
import { Table, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const LoggedInSessions = () => {
      const session = useSelector(state => state.auth.sessions);
    const sessions = [
  {
    sessionId: "8fbb4b6d-257d-4bf7-8ac6-771fbe059006",
    qr: null,
    realNumber: "919540215846",
    status: "✅ Logged in as 919540215846"
  },
    {
    sessionId: "8fbb4b6d-257d-4bf7-8ac6-771fbe059006",
    qr: null,
    realNumber: "919570215866",
    status: "✅ Logged in as 919540215846"
  }
];
  return (
    <Container className="mt-4">
      <h3>Logged-in Sessions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Session ID</th>
            <th>Phone Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {session.map((session, index) => (
            <tr key={session.sessionId}>
              <td>{index + 1}</td>
              <td>{session.sessionId}</td>
              <td>{session.realNumber}</td>
              <td>{session.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LoggedInSessions;
