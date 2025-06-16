import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BsClockHistory } from 'react-icons/bs';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { storeScheduleMessage } from '../../redux/MessageSlice';
const ScheduleSend = () => {
  const dispatch = useDispatch()
  const scheduledMessages = useSelector(state => state.message?.ScheduleMessage);

  const [upcomingMessages, setUpcomingMessages] = useState([]);

  useEffect(() => {
    const filterMessages = () => {
      if (Array.isArray(scheduledMessages) && scheduledMessages.length > 0) {
        const filtered = scheduledMessages.filter(
          msg => new Date(msg.scheduledFor).getTime() > Date.now()
        );
        setUpcomingMessages(filtered);

        // 🔴 Dispatch empty array when all messages are outdated
        if (filtered.length === 0) {
          dispatch(storeScheduleMessage([]));
        }
        
      } else {
        setUpcomingMessages([]);
        dispatch(storeScheduleMessage([])); // Dispatch if scheduledMessages itself is empty or undefined
      }
    };

    filterMessages();

    const intervalId = setInterval(() => {
      filterMessages();
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, [scheduledMessages, dispatch]);



  const handleShow = (msg) => {
    alert(`Scheduled For: ${new Date(msg.scheduledTime).toLocaleString()}\n\nMessage:\n${msg.message.join('\n')}`);
  };

  return (
    <Container className="mt-4">
      <Card className="mb-3 shadow-sm border-0">
        <Card.Header
          className="bg-success text-white d-flex align-items-center gap-2"
          style={{ padding: "0.5rem 1.5rem" }}
        >
          <BsClockHistory size={20} />
          <strong>Scheduled Messages</strong>
        </Card.Header>

        <ListGroup style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {upcomingMessages.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              📭 No scheduled messages
            </ListGroup.Item>
          ) : (
            upcomingMessages.map((msg, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => handleShow(msg)}
                className="d-flex justify-content-between align-items-start"
              >
                <div>


                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    ⏰ Scheduled For: {new Date(msg.scheduledFor).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true
                    })}

                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default ScheduleSend;
