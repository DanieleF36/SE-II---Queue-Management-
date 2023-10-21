import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function Homepage(props) {

  return (
    <div className='background-image-container'>
      <CustomNavbar loggedIn={props.loggedIn} user={props.user}/>
      <Container className="d-flex align-items-center justify-content-center" style={{marginTop: '50px'}}>
      <div>
        <h1>Welcome OQM Website!!!</h1>
      </div>
    </Container>
    </div>
  )
}

export { Homepage };