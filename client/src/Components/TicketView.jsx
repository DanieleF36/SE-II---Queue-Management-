import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomNavbar from './CustomNavbar'
import "./Login.css";



function TicketView(props) {

    const {service} = useParams();


    return (
        <div className='background-image-container'>
            <CustomNavbar loggedIn={props.loggedIn} user={props.user} />
            <Container className="justify-content-center" style={{ marginTop: '50px' }}>
                <Row>
                    <Col xs={10}>
                        <h4>Your Ticket:</h4>
                    </Col>

                </Row>
                <Row className="justify-content-center">
                    <Col xs={6} className="text-center border">
                        <p><strong>{props.ticket}</strong></p>
                    </Col>
                    <Col xs={2}>

                    </Col>
                    <Col xs={4}>
                        <h5 style={{ color: 'red' }}>{service} queue: <Button variant='danger'> {props.ticketD}</Button> people left !!</h5>

                    </Col>
                </Row>

            </Container>
            <Container className="justify-content-center" style={{ marginTop: '20px' }}>
                <Row>
                    <Col xs={10}>
                        <h4 style={{ color: 'green' }}>Current Served:</h4>
                    </Col>

                </Row>
                <Row className="justify-content-center">
                    <Col xs={6} className="text-center border">
                        <p style={{ color: 'green' }}><strong>{props.ticketC}</strong></p>
                    </Col>
                    <Col xs={2}>

                    </Col>
                    <Col xs={4}>


                    </Col>

                </Row>

            </Container>
        </div>


    )
}

export { TicketView };