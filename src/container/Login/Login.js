// src/components/Login.js
import React, { useState } from 'react';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { storetoken, storeuserdata } from '../../redux/authSlice';
import MyLoader from '../../components/Loding/MyLoader';
import '../../assets/css/Login.css'; // External CSS for extra custom styling

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await axios.post('http://13.53.41.83/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      dispatch(storetoken(res.data.token));
      dispatch(storeuserdata(res.data.user));
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/qrcode');
      }, 1500);
      setloading(false);
    } catch (err) {
      setloading(false);
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        <div className="login-page">
          <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <div style={{ maxWidth: '400px', width: '100%' }}>
              
              <Card className="shadow p-4 rounded-4 login-card">
                <h2 className="text-center mb-4 text-success fw-bold">Login</h2>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button variant="outline-secondary" onClick={togglePassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" className="w-100 fw-bold">
                    Login
                  </Button>
                </Form>
              </Card>
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default Login;
