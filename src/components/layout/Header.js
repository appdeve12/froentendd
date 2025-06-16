import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { FiInbox, FiSettings, FiHelpCircle, FiInfo } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { storeFiles } from '../../redux/FileAttachSlice';
import { storeMessage, storeScheduleMessage } from '../../redux/MessageSlice';
import { storeWhatsappNumber } from '../../redux/whatsappSlice';
import { storetoken } from '../../redux/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import { FaRegUserCircle } from "react-icons/fa";
import { FiClock, FiSend } from "react-icons/fi";
import "../../assets/css/custum.css"
const Header = () => {
   const session = useSelector(state => state.auth.sessions);
       console.log("redux sessions",session)
   const activeSessions = session?.filter(session =>
    session.status && session.status.toLowerCase().includes("logged in")
  ) || [];


  const dispatch=useDispatch()
      const userdata = useSelector(state => state.auth.userdata);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [showName, setShowName] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const handleRightClick = (e) => {
    e.preventDefault(); // prevent default context menu
    setPosition({ x: e.pageX, y: e.pageY });
    setShowName(true);
  };

  const handleClick = () => {
    setShowName(false); // hide name on left click
  };
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token'); // Adjust the key if different
    setShowLogoutModal(false);
dispatch(storeFiles([]));
dispatch(storeMessage([]));
dispatch(storeWhatsappNumber([]));
dispatch(storetoken(""))

    navigate('/'); // Redirect to login
    toast.success("Logout Successfully ")
  };
  const routehelp=()=>{
    navigate('/help')
  }
const Logesinsessions=()=>{
  navigate('/loginsessions')
}
const routeSentMessages=()=>{
  navigate('/sent')
}
  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm py-4">
        <Container fluid>
          {/* Brand */}
         <Navbar.Brand 
  className="fw-bold d-flex align-items-center gap-2 text-white"
  onClick={() => window.open('https://web.whatsapp.com', '_blank')}
  role="button"
  style={{ cursor: 'pointer' }}
>
  <FaWhatsapp size={24} />
  Whatsapp 
</Navbar.Brand>


          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center gap-4">
              {/* <Nav.Link  className="d-flex align-items-center gap-1 text-white fw-semibold">
                <FiInfo size={20} /> <span>About</span>
              </Nav.Link> */}
              <Nav.Link  className="d-flex align-items-center gap-1 text-white fw-semibold" onClick={()=>routehelp()}>
                <FiHelpCircle size={20} /> <span>Help</span>
              </Nav.Link>
             <Nav.Link className="position-relative d-flex align-items-center gap-1 text-white fw-semibold"onClick={()=>Logesinsessions()}>
      <FiInbox size={24} />
      <span>Logged In Sessions</span>
      {activeSessions.length > 0 && (
        <span className="badge-count">{activeSessions.length}</span>
      )}
    </Nav.Link>
                


<Button
  variant="outline-light"
  className="d-flex align-items-center gap-2 rounded-pill px-3 py-1"
  style={{ fontWeight: 600 }}
  onContextMenu={handleRightClick}
  onClick={() => routeSentMessages()}
>
  
  <FiSend size={20} />
Sent Messages Report
</Button>
<Button
  variant="outline-light"
  className="d-flex align-items-center gap-2 rounded-pill px-3 py-1"
  style={{ fontWeight: 600 }}
  onContextMenu={handleRightClick}
  onClick={handleClick}
>
  <FaRegUserCircle size={20} />
  {userdata?.username}
</Button>

        
              <button
                className="btn border-0 d-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                style={{
                  backgroundColor: '#128C7E',
                  color: 'white',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;

