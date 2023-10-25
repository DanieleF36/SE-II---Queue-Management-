import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function Homepage(props) {

  const [services, setServices] = useState(['shipping', 'fee paymenyts', 'financial consulence', 'info desk']);
  const [selservice, setSelService] = useState('shipping');


  const navigate = useNavigate();



  useEffect(() => {
    //adding API from backend

  }, []);

  

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
            <h3>Select a service:</h3>
            <div className="container d-flex align-items-center justify-content-center">
              <DropdownButton variant='success' id="dropdown-basic-button" title={selservice}>
                {services.map((service, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setSelService(service)}
                  >
                    {service}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            <div style={{marginTop:'20px'}} className="container d-flex align-items-center justify-content-center">
              <Button variant="danger" size="lg" className="btn-lg" onClick={()=>{props.handleGetTicket(selservice); navigate(`/${selservice}/ticket`);}}>
                Get a Ticket
              </Button>
            </div>
          </div>
        </Container>
      </div>
      
      
  )
}

export { Homepage };