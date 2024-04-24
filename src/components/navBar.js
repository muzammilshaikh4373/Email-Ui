import React from "react";
import "../assets/style/navBar.css";

const NavigationBar = ({ selectedFolder, handleFolderClick }) => {
  const folders = ["inbox", "sent", "drafts"];

  return (
    <div class="header">
      <div class="container">
        <div class="logo">
          <a href="#">Logo</a>
        </div>
        <div class="nav">
          <a href="#">Home</a>
          <a href="#">Blog</a>
          <a href="#">Contact Us</a>
          <a href="#">About</a>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
