import React, { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ show, onClose }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleSubMenu = (name) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  // Pour fermer le menu quand on clique sur un lien
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="start"
      className="custom-offcanvas"
      backdropClassName="custom-backdrop"
    >
      <Offcanvas.Header closeButton />
      <Offcanvas.Body>
        <nav className="side-links">

          <Link to="/" onClick={handleLinkClick}>NEW IN</Link>

          {/* CLOTHING with sub-menu */}
          <div className="submenu-section">
            <div
              className="submenu-header"
              onClick={() => toggleSubMenu('clothing')}
              style={{ cursor: 'pointer' }}
            >
              CLOTHING{' '}
              {activeMenu === 'clothing' ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {activeMenu === 'clothing' && (
              <div className="submenu-items">
                <Link to="/tshirts" onClick={handleLinkClick}>T-shirts</Link>
                <Link to="/jeans" onClick={handleLinkClick}>Jeans</Link>
                <Link to="/dresses" onClick={handleLinkClick}>Dresses</Link>
                <Link to="/blouses" onClick={handleLinkClick}>Blouses</Link>
              </div>
            )}
          </div>

          {/* Direct links */}
          <Link to="/shoes" onClick={handleLinkClick}>SHOES</Link>
          <Link to="/bags" onClick={handleLinkClick}>BAGS</Link>
          <Link to="/accessories" onClick={handleLinkClick}>ACCESSORIES</Link>
          <Link to="/total-look" onClick={handleLinkClick}>
            TOTAL LOOK <span className="new-badge">NEW</span>
          </Link>
          <Link to="/info" onClick={handleLinkClick}>+ INFO</Link>

        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SideMenu;
