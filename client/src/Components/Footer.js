import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>HELP</h4>
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
{/* Lien Instagram */}
          <a
            // href="https://www.instagram.com/class_clothing_hbh/"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            INSTAGRAM
          </a>        
             {/* Lien Facebook */}
          <a
            // href="https://www.facebook.com/profile.php?id=61554849483493"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            FACEBOOK
          </a>
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
