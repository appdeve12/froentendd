import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MyLoader from '../../components/Loding/MyLoader';
import { ToastContainer, toast } from 'react-toastify';
const SentMessages = () => {
  const token = useSelector(state => state.auth.token);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://13.53.41.83/whatsapp/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          toast.success("Data Fetching Successfully !")
          const sorted = [...res.data.messages].sort((a, b) => {
            return sortOrder === 'asc'
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          });
          setMessages(sorted);
        }
      } catch (err) {

        console.error('Error fetching messages:', err);
                  toast.error("Error fetching Report !")
         setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sortOrder, token]);

  useEffect(() => {
    filterMessages();
  }, [messages, dateFilter, customStartDate, customEndDate]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);

  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const filterMessages = () => {
    let filtered = [...messages];

    if (dateFilter === 'today') {
      filtered = filtered.filter(msg => isToday(new Date(msg.createdAt)));
    } else if (dateFilter === 'yesterday') {
      filtered = filtered.filter(msg => isYesterday(new Date(msg.createdAt)));
    } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
      filtered = filtered.filter(msg => {
        const createdAt = new Date(msg.createdAt);
        return createdAt >= customStartDate && createdAt <= customEndDate;
      });
    }

    setFilteredMessages(filtered);
  };

  return (
    <Container className="mt-4">
      <h3>📤 Sent  Messages Report</h3>

      <Row className="my-3">
        <Col md={3}>
          <Form.Select value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={dateFilter} onChange={handleDateFilterChange}>
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Range</option>
          </Form.Select>
        </Col>

        {dateFilter === 'custom' && (
          <>
            <Col md={3}>
              <DatePicker
                selected={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                placeholderText="Start Date"
                className="form-control"
              />
            </Col>
            <Col md={3}>
              <DatePicker
                selected={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                placeholderText="End Date"
                className="form-control"
              />
            </Col>
          </>
        )}
      </Row>

      {loading ? (
        <MyLoader />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Message</th>
              <th>PDF</th>
              <th>Photo</th>
              <th>Video</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg, index) => (
              <tr key={msg._id}>
                <td>{index + 1}</td>
                <td>{msg.from}</td>
                <td>{msg.to.join(', ')}</td>
                <td>{msg.message.join(' | ')}</td>
                <td>{msg.pdf || '-'}</td>
                <td>{msg.photo?.length ? msg.photo.join(', ') : '-'}</td>
                <td>{msg.video || '-'}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SentMessages;
