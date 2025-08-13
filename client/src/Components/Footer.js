import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>HELP</h4>
          <a href="#">HOW TO SHOP ONLINE</a>
          <a href="#">PAYMENT</a>
          <a href="#">DELIVERY</a>
          <a href="#">EXCHANGES AND RETURNS</a>
          <a href="#">SIZE GUIDE</a>
        </div>

        <div className="footer-column">
          <h4>CUSTOMER SERVICE</h4>
          <a href="#">CONTACT</a>
        </div>

        <div className="footer-column">
          <h4>COMPANY</h4>
          <a href="#">ABOUT US</a>
        </div>


        <div className="footer-column">
          <h4>SOCIAL</h4>
          <a href="#">INSTAGRAM</a>
          <a href="#">FACEBOOK</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <a href="#">TERMS & CONDITIONS</a>
          <a href="#">PRIVACY POLICY</a>
        </div>
        <div className="footer-lang">
          <span role="img" aria-label="globe">🌐</span> TUNISIA | ENGLISH
        </div>
      </div>
    </footer>
  );
};

export default Footer;
