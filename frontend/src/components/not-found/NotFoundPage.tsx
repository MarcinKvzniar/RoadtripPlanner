import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pirate-container">
      <h1 className="pirate-title">404</h1>
      <p className="pirate-message">Arrr! This page has been lost at sea!</p>
      <a href="/" className="pirate-button">
        Set Sail Back Home
      </a>
      <div className="pirate-ship"></div>
      <div className="pirate-waves"></div>
    </div>
  );
};

export default NotFoundPage;
