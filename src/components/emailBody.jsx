import React, { useState, useEffect } from "react";
import "../assets/style/emailBody.css";
import { emailArray } from "./email.js";

const EmailClient = () => {
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [emails, setEmails] = useState(emailArray);

  useEffect(() => {
    updateBadges();
  }, [selectedFolder, emails]);

  const updateBadges = () => {
    // Calculate unread counts for the inbox folder
    const unreadCount = emails.filter(
      (email) => email.folder === "INBOX" && !email.isRead
    ).length;
    // Update badge for inbox
    document.getElementById("inbox-badge").innerText = unreadCount;
  };

  const handleMessageClick = (messageId) => {
    const updatedEmails = emails.map((email) =>
      email.id === messageId ? { ...email, isRead: true } : email
    );
    const message = updatedEmails.find((email) => email.id === messageId);
    setSelectedMessage(message);
    setEmails(updatedEmails);
    updateBadges(); // Update badges when message is clicked
  };

  const filteredEmails = emails.filter(
    (email) => email.folder === selectedFolder
  );

  return (
    <div className="container-fluid">
      <div className="email row">
        {/* Folders Pane */}
        <div className="email-folders-pane col-sm-2">
          <ul className="email-folders">
            <li key="INBOX" data-folder="INBOX">
              <button type="button" onClick={() => setSelectedFolder("INBOX")}>
                Inbox
                <span className="badge" id="inbox-badge">
                  {
                    emails.filter(
                      (email) => email.folder === "INBOX" && !email.isRead
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
            <div className="list-count">{filteredEmails.length} messages</div>
            <div className="mail-list-scroller">
              {filteredEmails.map((email) => (
                <li
                  key={email.id}
                  className={`email-message-item ${
                    selectedMessage?.id === email.id ? "active" : ""
                  } ${email.isRead ? "" : "unread"}`}
                  onClick={() => handleMessageClick(email.id)}
                >
                  <div className="message-from">{email.from}</div>
                  <div className="message-subject">{email.subject}</div>
                </li>
              ))}
            </div>
          </div>
        </div>

        <div className="email-message-detail-pane col-sm-7">
          <div className="email-message-detail">
            {selectedMessage ? (
              <>
                <div className="message-from">from : {selectedMessage.from}</div>
                <br />
                <div className="message-subject">Subject : {selectedMessage.subject}</div>
                <br />
                <div
                  className="message-body"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                />
                <button className="ticket-btn">Generate Ticket</button>
              </>
            ) : (
              <div className="message-body">No message selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailClient;
