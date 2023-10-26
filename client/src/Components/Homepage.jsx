import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";
import API from '../API';



function Homepage(props) {

  const [services, setServices] = useState(['shipping', 'fee paymenyts', 'financial consulence', 'info desk']);
  const [selservice, setSelService] = useState('shipping');
  const [counterSer, setCounterSer] = useState(['shipping', 'fee paymenyts']);
  const [options, setOptions] = useState([])
  const [officer, setOfficer] = useState([])
  const [rows, setRows] = useState([])
  const [counter, setCounter] = useState();
  const [counterInfo, setCounterInfo] = useState([])
  const [officerInfo, setofficerInfo] = useState([])
  const handleCounterChange = (event) => {
    // Update the counter state with the selected value
    setCounter(event.target.value);
  };

  const handleOfficerChange = (event) => {
    // Update the counter state with the selected value
    setOfficer(event.target.value);
  };

  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (optionValue) => {
    if (selectedOptions.includes(optionValue)) {
      setSelectedOptions(selectedOptions.filter((value) => value !== optionValue));
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  };

  const [showOptions, setShowOptions] = useState(false);

  const handleShowOptions = () => {
    if (showOptions == false)
      setShowOptions(true);
    else 
      setShowOptions(false);
  };

  const handleCounterAdd = () => {
    console.log(counter)
    console.log(selectedOptions)
    console.log(officer)
    API.addServiceToCounter(counter, selectedOptions[0], officer)
  };

  useEffect(() => {
    //adding API from backend
    API.getCounterDetails().then((rows) => {
      setRows(rows);
    })
    API.listServices().then((s) => {
      setOptions(s)
    });
    API.getCounterNumber().then((c) =>{
       setCounterInfo(c);
    })
    API.getOfficer().then((o)=>{
      setofficerInfo(o);
    })
  }, []);

  console.log(rows)
  
  return (
    props.user ? props.user.role === 'admin' ? <div className='background-image-container'>
      <CustomNavbar ticket={props.ticket} selservice={props.selservice} loggedIn={props.loggedIn} user={props.user} />
      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '50px', width: '100%' }}>
        <Table >
          <thead>
            <tr>
              <th>Counter</th>
              <th>Services</th>
              <th>Officer Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {rows.officer}
            </tr>
          </tbody>
        </Table>
      </Container>
      <Container>
        <Row>
          <Col>
            <Form.Select aria-label="Select an option" onClick={handleCounterChange}>
                  {counterInfo.map((value) => (
                    <option key={value.id}>
                      {value.id}
                    </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Button onClick={handleShowOptions}>Show Options</Button>
                {showOptions && (
              <div>
                {options.map((option) => (
                  <Form.Check
                  key={option.name}
                  type="checkbox"
                  label={option.name}
                  checked={selectedOptions.includes(option.name)}
                  onChange={() => handleOptionChange(option.name)}
                />
              ))}
            </div>
          )}
          </Col>
          <Col>
          <Form.Select aria-label="Select an option" onClick={handleOfficerChange}>
                  {officerInfo.map((value) => (
                    <option key={value.id}>
                      {value.id}
                    </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row >
          <div className="mb-2 d-flex justify-content-center">
            <Button variant="primary" size="lg" onClick={handleCounterAdd}>
              Confirm
            </Button>{' '}
            <Button variant="secondary" size="lg" onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </div>
        </Row>
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
              <Button style={{ marginLeft: '10px' }} variant="success" size="lg" className="btn-lg" onClick={() => { props.handleNextCustomer(); navigate('/'); }}>
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