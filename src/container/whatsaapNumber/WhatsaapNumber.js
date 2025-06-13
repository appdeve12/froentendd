import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Card, Dropdown, ButtonGroup, Modal, Button, Form } from 'react-bootstrap';
import { BiMenu } from 'react-icons/bi';
import ManualImportModal from "../../components/Modal/ManualImportModal";
import { useDispatch, useSelector } from 'react-redux';
import "../../assets/css/custum.css"
import { storeWhatsappNumber } from '../../redux/whatsappSlice';
import * as XLSX from 'xlsx';

const WhatsaapNumber = () => {
  const dispatch = useDispatch();
  const numbers = useSelector(state => state.whatsapp.whatsappNumber);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clearLisrModal, setclearLisrModal] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [showManualImport, setShowManualImport] = useState(false);
  const fileInputRef = useRef(null);
  const handleSelect = (eventKey) => {
    if (eventKey === 'Insert Country Code') {
      setShowModal(true);
    } else if (eventKey === 'Manual import') {
      setShowManualImport(true);
    }
    else if (eventKey === 'Clear List') {
      setclearLisrModal(true);
    }
    else if (eventKey === 'Import From File') {
      fileInputRef.current.click(); // trigger hidden file input
    }

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'txt' || fileExtension === 'csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

        const parsedContacts = lines.map(line => {
          const [name, number] = line.split(',');
          return { name: name?.trim(), number: number?.trim(), var1: '' };
        });

        processContacts(parsedContacts);
      };
      reader.readAsText(file);
    } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming contacts are on the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON array of objects
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // header:1 means output will be array of arrays (rows and columns)

        // Now parse jsonData rows
        // Assume first row may be headers, or simply parse all rows for name and number in first 2 columns:
        const parsedContacts = jsonData.map(row => {
          const name = row[0] ? String(row[0]).trim() : '';
          const number = row[1] ? String(row[1]).trim() : '';
          return { name, number, var1: '' };
        }).filter(contact => contact.name && contact.number); // filter out empty rows

        processContacts(parsedContacts);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file type!');
    }
  };

  // Helper function to remove duplicates and update state & dispatch
  const processContacts = (parsedContacts) => {
    const seen = new Set();
    const uniqueContacts = parsedContacts.filter(contact => {
      const key = `${contact.name}-${contact.number}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    dispatch(storeWhatsappNumber(uniqueContacts));
    setContacts(uniqueContacts);
  };


  const handleClose = () => {
    setShowModal(false);
    setCountryCode('');
  };
  const handleClosed = () => {
    setclearLisrModal(false);

  };
  const handleClearClose = () => {
    setclearLisrModal(false);
    dispatch(storeWhatsappNumber([]));

  }

  const handleOk = () => {

    handleClose();
  };


  const handleManualImport = (importedContacts) => {
    dispatch(storeWhatsappNumber(importedContacts));
    setContacts(importedContacts);

    setShowManualImport(false);
  };




  return (
    <div>
      <input
        type="file"
        accept=".txt,.csv,.xls,.xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Card className="mb-3 shadow-sm border-0">

        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center" style={{ padding: "0.5rem 1.5rem" }}>
          <strong>WhatsApp Number</strong>
          <Dropdown onSelect={handleSelect} as={ButtonGroup}>
            <Dropdown.Toggle
              variant="success"
              className="p-0 border-0 shadow-none no-caret"
            >
              <BiMenu size={22} color="white" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              <Dropdown.Item eventKey="Import From File">Import From File</Dropdown.Item>
              <Dropdown.Item eventKey="Manual import">Manual import</Dropdown.Item>

              <Dropdown.Item eventKey="Clear List">Clear List</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Card.Header>


        <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Table striped bordered hover size="sm" className="bg-white">
            <thead className="bg-secondary text-white">
              <tr>
                <th>Campaign Name</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {numbers && numbers.length > 0 ? (
                numbers.map((item, index) => (
                  <tr key={index}>
                    <td className="text-dark">{item.name}</td>
                    <td className="text-dark">{item.number}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">No data</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

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
          <small>Total: {numbers.length}</small>
          <small>Contacts: {numbers.length}</small>

        </div>
      </Card>
      {/* Modal for Insert Country Code */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Insert Country Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCountryCode">
              <Form.Label>Country Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country code (e.g., +91)"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={clearLisrModal} onHide={handleClosed} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCountryCode">
              <Form.Label>Are You Sure You Want To Clear</Form.Label>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosed}>Cancel</Button>
          <Button variant="primary" onClick={handleClearClose}>OK</Button>
        </Modal.Footer>
      </Modal>


      {showManualImport && (
        <ManualImportModal
          show={showManualImport}
          handleClose={() => setShowManualImport(false)}
          handleImport={handleManualImport}
        />
      )}
    </div>
  );
};

export default WhatsaapNumber;
