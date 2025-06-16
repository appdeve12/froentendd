import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Dropdown, ButtonGroup, Modal } from 'react-bootstrap';
import { BiMenu } from 'react-icons/bi';
import "../../assets/css/custum.css";
import { useDispatch, useSelector } from 'react-redux';
import { storeFiles } from '../../redux/FileAttachSlice';
import { toast } from 'react-toastify';

const FileAttachment = () => {
  const dispatch = useDispatch();
  const attachfile = useSelector(state => state.fileAttach.FileAttach);

  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState('');
  const [shouldOpenFileDialog, setShouldOpenFileDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const baseURL = "http://56.228.42.114";

  const getFullUrl = (url) => url?.startsWith('http') ? url : `${baseURL}${url}`;

  // Trigger file input after fileType is updated and input re-rendered
  useEffect(() => {
    if (shouldOpenFileDialog && fileInputRef.current) {
      fileInputRef.current.click();
      setShouldOpenFileDialog(false);
    }
  }, [fileType, shouldOpenFileDialog]);

  const handleFileSelect = (eventKey) => {
    if (eventKey === 'Clear') {
      dispatch(storeFiles([]));
      return;
    }

    setFileType(eventKey);
    setShouldOpenFileDialog(true);
  };

  const getFieldName = (type) => {
    switch (type) {
      case 'Photos': return 'photo';
      case 'Videos': return 'video';
      case 'Docx': return 'docx';
      case 'Pdf': return 'pdf';
      default: return 'file';
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fieldName = getFieldName(fileType);
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await axios.post(`${baseURL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data.files?.[fieldName];
      const fullUrl = getFullUrl(uploadedUrl);

      const newFile = {
        name: file.name,
        type: fileType,
        url: fullUrl,
      };

      dispatch(storeFiles([...attachfile, newFile]));
      toast.success("Uploaded Successfully", {
        autoClose: 2000,
        toastId: 'upload-success',
      });

    } catch (err) {
      console.error('Upload failed:', err);
      toast.error("Failed to upload file.", { autoClose: 2000 });
    }

    event.target.value = '';
  };

  const handlePreviewClick = (file) => {
    setPreviewFile(file);
    setShowModal(true);
  };

  return (
    <>
      <input
        key={fileType}
        type="file"
        accept={
          fileType === 'Photos' ? 'image/*' :
            fileType === 'Videos' ? 'video/*' :
              fileType === 'Pdf' ? '.pdf' :
                fileType === 'Docx' ? '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                  '*'
        }
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Card className="mb-3 shadow-sm border-0">
        <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
          <strong>Attach Files & Photos</strong>
          <Dropdown onSelect={handleFileSelect} as={ButtonGroup}>
            <Dropdown.Toggle variant="success" className="p-0 border-0 shadow-none no-caret">
              <BiMenu size={22} color="white" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item eventKey="Photos">Photos</Dropdown.Item>
              <Dropdown.Item eventKey="Videos">Videos</Dropdown.Item>
              <Dropdown.Item eventKey="Pdf">Pdf</Dropdown.Item>
              <Dropdown.Item eventKey="Docx">Docx</Dropdown.Item>
              <Dropdown.Item eventKey="Clear">Clear</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>


        <Card.Body>
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm" className="bg-white">
              <thead className="bg-secondary text-white">
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>                                                    
                {attachfile.length > 0 ? (
                  attachfile.map((file, idx) => (
                    <tr key={idx}>
                      <td>
                        <a href={getFullUrl(file.url)} target="_blank" rel="noopener noreferrer">{file.name}</a>
                      </td>
                      <td>{file.type}</td>
                      <td>
                        <span style={{ cursor: 'pointer' }} onClick={() => handlePreviewClick(file)}>
                          {file.type === 'Photos' && (
                            <img src={getFullUrl(file.url)} alt={file.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                          )}
                          {file.type === 'Videos' && (
                            <video width="120" height="80">
                              <source src={getFullUrl(file.url)} type="video/mp4" />
                            </video>
                          )}
                          {(file.type === 'Pdf' || file.type === 'Docx') && (
                            <span className="text-primary text-decoration-underline">Preview</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">No files attached</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Preview Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{previewFile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {previewFile?.type === 'Photos' && (
            <img
              src={getFullUrl(previewFile.url)}
              alt={previewFile.name}
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
          {previewFile?.type === 'Videos' && (
            <video width="100%" height="auto" controls>
              <source src={getFullUrl(previewFile.url)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {previewFile?.type === 'Pdf' && (
            <iframe
              src={getFullUrl(previewFile.url)}
              width="100%"
              height="500px"
              title={previewFile.name}
              style={{ border: 'none' }}
            />
          )}
          {previewFile?.type === 'Docx' && (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(getFullUrl(previewFile.url))}`}
              width="100%"
              height="500px"
              frameBorder="0"
              title={previewFile.name}
            />
          )}
        </Modal.Body>
      </Modal>

    </>
  );
};

export default FileAttachment;
