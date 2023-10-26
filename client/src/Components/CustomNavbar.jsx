import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import './CustomNavbar.css';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = (props) => {
  return (
    <Navbar className="full-width-navbar custom-navbar">
      <Navbar.Brand className="custom-brand">
        <img
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
        <span className="title">OQM</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Nav.Link className='custom-link'>Home</Nav.Link>
      <Navbar.Collapse id="navbar-nav" className="justify-content-end">
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;