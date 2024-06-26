import React, { useState, useEffect } from "react";
import "../assets/style/emailBody.css";
import { emailArray } from "./email.js";
import { Modal, Button, Form, Col, Row, Spinner } from 'react-bootstrap';
import axios from  'axios'
import { useForm } from "react-hook-form";

const EmailClient = () => {
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [emails, setEmails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state to true
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ticketGeneratedForMessage, setTicketGeneratedForMessage] = useState({});

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setEmails(emailArray);
      setLoading(false); // Set loading to false once data is received
    }, 2000);
  }, []);

  // useEffect(()=>{
  //   setLoading(true)
  //   axios.get('http://localhost:5000/mails/all')
  //   .then(response => {
  //     console.log(response.data); // Assuming the data is in response.data
  //     setEmails(response.data)
  //     setLoading(false)
  //   })
  //   .catch(error => {
  //     console.error('Error fetching mails:', error);
  //   });
  // } , [])

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const Submit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    handleClose(); // Close modal after form submission
  };

  const onSubmit = (data) => {
    
    const postData = {
      ...selectedMessage,
      formData: data
    };

    console.log(postData);
    handleClose()
  
    // axios.post("your_api_endpoint", postData)
    //   .then(response => {
    //     console.log("Ticket submitted successfully:", response.data);
    //     handleClose(); 
    //   })
    //   .catch(error => {
    //     console.error('Error submitting ticket:', error);
    //   });

    setTicketGeneratedForMessage(prevState => ({
      ...prevState,
      [selectedMessage.messageId]: true
    }));
  };
  const updateBadges = () => {

    const unreadCount = emails.filter(
      (email) => email.folder === "INBOX" && !email.seen
    ).length;
    // Update badge for inbox
    document.getElementById("inbox-badge").innerText = unreadCount;
  };

  const handleMessageClick = (messageId) => {
    const updatedEmails = emails.map((email) =>
      email.messageId === messageId ? { ...email, seen: true } : email
    );
    const message = updatedEmails.find((email) => email.messageId === messageId);
    setSelectedMessage(message);
    setEmails(updatedEmails);
    updateBadges();
    setTicketGeneratedForMessage(prevState => ({
      ...prevState,
      [messageId]: ticketGeneratedForMessage[messageId] || false
    }));
  };

  const filteredEmails = emails.filter(
    (email) => email.folder === selectedFolder
  );

  return (
    <div className="container-fluid">
      <div className="email row">
        <div className="email-folders-pane col-sm-2">
          <ul className="email-folders">
            <li key="INBOX" data-folder="INBOX">
              <button type="button" onClick={() => setSelectedFolder("INBOX")}>
                Inbox
                <span className="badge" id="inbox-badge">
                  {
                    emails.filter(
                      (email) => email.folder === "INBOX" && !email.seen
                    ).length
                  }
                </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="email-message-list-pane col-sm-3">
          <div className="list-details">
            <h3 className="list-name">{selectedFolder.toUpperCase()}</h3>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <div className="list-count">{filteredEmails.length} messages</div>
                <div className="mail-list-scroller">
                  {filteredEmails.map((email) => (
                    <li
                      key={email.messageId}
                      className={`email-message-item ${
                        selectedMessage?.messageId === email.messageId ? "active" : ""
                      } ${email.seen ? "" : "unread"}`}
                      onClick={() => handleMessageClick(email.messageId)}
                    >
                      <div className="message-from">{email.from}</div>
                      <div className="message-subject">{email.subject}</div>
                    </li>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="email-message-detail-pane col-sm-7">
          <div className="email-message-detail scrollable">
            {selectedMessage ? (
              <>
                <div className="message-from insidemail">from : {selectedMessage.from}</div>
                <br />
                <div className="message-subject insidemail">Subject : {selectedMessage.subject}</div>
                <br /> 
                <hr /> 
                <div
                  className="message-body"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                />
                <div>
                <button
                  className={`ticket-btn ${ticketGeneratedForMessage[selectedMessage.messageId] ? 'disabled' : ''}`}
                    onClick={handleShow}
                    disabled={ticketGeneratedForMessage[selectedMessage.messageId]}
                  >
                    Generate Ticket
                  </button>
                </div>
              </>
            ) : (
              <div className="message-body">No message selected.</div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        {/* Modal content */}
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  {...register("name", { required: true })}
                />
                {errors.name && <span className="text-danger">Name is required</span>}
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  {...register("email", { required: true })}
                />
                {errors.email && <span className="text-danger">Email is required</span>}
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formTicketType">
                <Form.Label>Ticket Type</Form.Label>
                <Form.Control as="select" {...register("ticketType")}>
                  <option value="Request">Request</option>
                  <option value="category">category</option>
                  <option value="sub-category">sub-category</option>
                </Form.Control>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe your task."
                  {...register("description", { required: true })}
                />
                {errors.description && <span className="text-danger">Description is required</span>}
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Col className="text-center">
                <Button variant="success" type="submit">Submit Ticket</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmailClient;