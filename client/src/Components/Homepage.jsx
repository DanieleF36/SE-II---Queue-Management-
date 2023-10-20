import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function Homepage(props) {

  return (
    <div className='background-image-container'>
      <CustomNavbar />
      <Container className="d-flex align-items-center justify-content-center" style={{marginTop: '50px'}}>
      <div>
        <h1>Welcome OQM Office!!!</h1>
      </div>
    </Container>
    </div>
  )
}

export { Homepage };