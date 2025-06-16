import React from 'react';
import { Table, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const LoggedInSessions = () => {
      const session = useSelector(state => state.auth.sessions);
      console.log("redux sessions",session)

  return (
    <Container className="mt-4">
      <h3>Logged-in Sessions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
         
            <th>Phone Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {session.map((session, index) => (
            <tr key={session.sessionId}>
              <td>{index + 1}</td>
            
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
