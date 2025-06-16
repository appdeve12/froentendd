// src/App.js
import {findDOMNode} from 'react-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './container/Login/Login';
import Dashboard from './components/layout/Dashboard';
import SentMessages from './container/SentMessages/SentMessages';
import Help from './container/Help/Help';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

// Import ToastContainer and Toastify CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeLogin from './container/QRcodeLogin/QRcodeLogin';
import LoggedInSessions from './container/QRcodeLogin/LoggedInSessions';

function App() {
  return (
    <Router>
      <>
        {/* ToastContainer placed here so it can be used anywhere in app */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}  // limit max toasts shown at once
        />

        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/qrcode"
            element={
              <PrivateRoute>
                <QRCodeLogin />
              </PrivateRoute>
            }
          />
              <Route
            path="/loginsessions"
            element={
              <PrivateRoute>
                <LoggedInSessions />
              </PrivateRoute>
            }
          />
          <Route
            path="/sent"
            element={
              <PrivateRoute>
                <SentMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
        </Routes>
      </>
    </Router>
  )

}

export default App;
