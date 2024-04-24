import React, { useState, useEffect } from "react";
import "../assets/style/emailBody.css";
import { emailArray } from "./email.js";

const EmailClient = () => {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [emails, setEmails] = useState(emailArray);

  useEffect(() => {
    updateBadges();
  }, [selectedFolder, emails]);

  const updateBadges = () => {
    // Calculate unread counts for each folder
    const unreadCounts = emails.reduce((counts, email) => {
      if (email.folder in counts) {
        counts[email.folder] += email.isRead ? 0 : 1;
      } else {
        counts[email.folder] = email.isRead ? 0 : 1;
      }
      return counts;
    }, {});

    
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    updateBadges();
  };

  const handleMessageClick = (messageId) => {
    const updatedEmails = emails.map((email) =>
      email.id === messageId ? { ...email, isRead: true } : email
    );
    const message = updatedEmails.find((email) => email.id === messageId);
    setSelectedMessage(message);
    setEmails(updatedEmails);
    updateBadges();
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
            {["inbox", "sent", "drafts", "trash"].map((folder) => (
              <li key={folder} data-folder={folder}>
                <button type="button" onClick={() => handleFolderClick(folder)}>
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                  <span className="badge">
                    {
                      emails.filter(
                        (email) => email.folder === folder && !email.isRead
                      ).length
                    }
                  </span>
                </button>
              </li>
            ))}
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
                  }`}
                  onClick={() => handleMessageClick(email.id)}
                >
                  <div className="message-from">{email.from}</div>
                  {/* <div className="message-date">{email.date}</div> */}
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
                <div className="message-from">{selectedMessage.from}</div>
                <div className="message-to">To: {selectedMessage.to}</div>
                <div className="message-subject">{selectedMessage.subject}</div>
                <div
                  className="message-body"
                  dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
                />
                <button  className="ticket-btn">Generate Ticket</button>
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
