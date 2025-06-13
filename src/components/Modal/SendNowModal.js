import React from 'react';
import { Modal, Button, Table, ProgressBar } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SendNowModal = ({ show, handleClose, sentMessages }) => {

  const exportToExcel = () => {
    const worksheetData = sentMessages.map(msg => ({
      ID: msg.id,
      Type: msg.type,
      'Sending Date': msg.date,
      Status: msg.status,
      Message: msg.message,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SentMessages");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "SentMessages.xlsx");
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Sending Bulk - Blind Mode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Sending Process ({sentMessages.length}/{sentMessages.length})</h6>
        <ProgressBar now={100} variant="success" className="mb-3" />
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Sending Date</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {sentMessages.map((msg, idx) => (
              <tr key={idx}>
                <td>{msg.id}</td>
                <td>{msg.type}</td>
                <td>{msg.date}</td>
                <td className="text-success">{msg.status}</td>
                <td>{msg.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={exportToExcel}>Export</Button>
        <Button variant="danger" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendNowModal;
