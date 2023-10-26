import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function Homepage(props) {

  const [services, setServices] = useState(['shipping', 'fee paymenyts', 'financial consulence', 'info desk']);
  const [selservice, setSelService] = useState('shipping');
  const [counterid, setCounterId] = useState('1');
  const [counterSer, setCounterSer] = useState(['shipping', 'fee paymenyts']);


  const navigate = useNavigate();



  useEffect(() => {
    //adding API from backend

  }, []);



  return (
    props.user ? props.user.role === 'admin' ? <div className='background-image-container'>
      <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user} />
      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px' }}>
        <div>
          <h1>Welcome OQM Website!!! - (Administrator View)</h1>
        </div>
      </Container>
    </div>
      : <div className='background-image-container'>
        <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user} />
        <Container className="justify-content-center" style={{ marginTop: '40px' }}>
          <Row>
            <Col xs={3}>
              <div>
                <h6>Officer's counter ID: <Button>{counterid}</Button></h6>
                <h6>Service offered by the counter:</h6>
                {counterSer.map(e => <h6><Button>{e}</Button></h6>)}
              </div>
            </Col>

            <Col xs={6}><div style={{ marginTop: '20px' }} className="d-flex align-items-center justify-content-center">
            <h5>Press the button to call the next customer:</h5>
              <Button style={{marginLeft:'10px'}} variant="success" size="lg" className="btn-lg" onClick={()=>{props.handleNextCustomer(); navigate('/');}}>
                Next Customer
              </Button>
            </div></Col>
          </Row>
          <Row><h6>Current Served: <Button>{props.ticketC}</Button></h6></Row>
        </Container>
      </div> :
      <div className='background-image-container'>
        <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user} />
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
            <div style={{ marginTop: '20px' }} className="container d-flex align-items-center justify-content-center">
              <Button variant="danger" size="lg" className="btn-lg" onClick={() => { props.handleGetTicket(selservice); navigate(`/${selservice}/ticket`); }}>
                Get a Ticket
              </Button>
            </div>
          </div>
        </Container>
      </div>


  )
}

export { Homepage };