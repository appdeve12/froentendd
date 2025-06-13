import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ManualImportModal = ({ show, handleClose, handleImport }) => {
  const [campaignName, setCampaignName] = useState('');
  const [numbersText, setNumbersText] = useState('');
  const [removeDuplication, setRemoveDuplication] = useState(true);

  const processContacts = () => {
    let numbers = numbersText
      .split(/[\n,]+/) // split by newlines or commas
      .map(num => num.trim())
      .filter(Boolean); // remove empty

    if (removeDuplication) {
      numbers = [...new Set(numbers)];
    }

    const contacts = numbers.map(number => ({
      name: campaignName,
      number
    }));

    handleImport(contacts);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Manual Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Enter Mobile Numbers</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter numbers separated by commas or new lines"
            value={numbersText}
            onChange={(e) => setNumbersText(e.target.value)}
          />
        </Form.Group>

        <Form.Check
          className="mt-2"
          type="checkbox"
          label="Remove duplication"
          checked={removeDuplication}
          onChange={(e) => setRemoveDuplication(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={processContacts}>Import</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManualImportModal;
