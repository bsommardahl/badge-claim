import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { getUserEmail, logOut, logIn } from './../functions/FirebaseU/FirebaseUtils';

class AppNavbar extends Component {
    constructor(props){
        super(props)
        this.state = {user: ""}
    }

    async componentDidMount(){
        const user = await getUserEmail();
        this.setState({user: user.email});
    }

    render () {
        const isLogged = this.state.user === "";
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/explore">Badge Claim</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Badges</Nav.Link>
                        <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
                        <Nav.Link as={Link} to="/groups">Groups</Nav.Link>
                        <Nav.Link as={Link} to="/webhooks">Webhooks</Nav.Link>
                    </Nav>
                    <div>{isLogged ? 
                        <Button variant="outline-info" onClick={() => logIn()}>Log In</Button> :  
                        <Button variant="outline-info"  onClick={() => logOut()}>Sign Out</Button>}
                    </div>
                </Navbar.Collapse>
            </Navbar>
        )
}}

export default AppNavbar