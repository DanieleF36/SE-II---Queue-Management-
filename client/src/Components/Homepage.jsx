import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function Homepage(props) {

  return (
    props.user ? props.user.role === 'admin' ? <div className='background-image-container'>
      <CustomNavbar loggedIn={props.loggedIn} user={props.user} />
      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
        <div>
          <h1>Welcome OQM Website!!! - (Administrator View)</h1>
        </div>
      </Container>
    </div>
      : <div className='background-image-container'>
        <CustomNavbar loggedIn={props.loggedIn} user={props.user} />
        <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
          <div>
            <h1>Welcome OQM Website!!! - (Officer View)</h1>
          </div>
        </Container>
      </div> :
      <div className='background-image-container'>
        <CustomNavbar loggedIn={props.loggedIn} user={props.user} />
        <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
          <div>
            <h1>Welcome OQM Website!!! - (Normal User View) </h1>
          </div>
        </Container>
      </div>
  )
}

export { Homepage };