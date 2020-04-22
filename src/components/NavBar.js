import React from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavItem from 'react-bootstrap/NavItem'
import Button from 'react-bootstrap/Button'
//import Form from 'react-bootstrap/Form'
//import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'


import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const { user, isAuthenticated, getTokenSilently, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

  (async () => {
    await getTokenSilently()
  })()

  /*
  const handleSubmit = event => {
    alert(JSON.stringify(event))
    console.log(event, 'this triggered')
    event.stopPropagation()
    event.preventDefault()
    const form = event.currentTarget;

    console.log(form)
  };

  <Form inline onSubmit={handleSubmit}>
    <FormControl onChange={updateSearch} type="text" placeholder="Search" className="mr-sm-2" />
    <Button type="submit">Search</Button>
  </Form>
  */

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand to="/" as={NavLink}>Snacker-Tracker UI</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link to="/top-scans" as={NavLink}>Top Scans</Nav.Link>
          <Nav.Link to="/last-scans" as={NavLink}>Last Scans</Nav.Link>
          <Nav.Link to="/categories" as={NavLink}>Categories</Nav.Link>
        </Nav>

        {!isAuthenticated && (
          <NavItem>
            <Button
              id="qsLoginBtn"
              color="primary"
              className="btn-margin"
              onClick={() => loginWithRedirect({login_hint: 'line'})}
            >
              Log in (line)
            </Button>

            <Button
              id="qsLoginBtn"
              color="primary"
              className="btn-margin"
              onClick={() => loginWithRedirect({login_hint: 'facebook'})}
            >
              Log in (fb)
            </Button>

            <Button
              id="qsLoginBtn"
              color="primary"
              className="btn-margin"
              onClick={() => loginWithRedirect()}
            >
              Log in
            </Button>
          </NavItem>
        )}

        {isAuthenticated && (
          <Dropdown drop="down">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <img
                src={user.picture}
                alt="Profile"
                className="nav-user-profile rounded-circle"
                width="50"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item to="/profile" as={NavLink}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => logoutWithRedirect()}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

      </Navbar.Collapse>
    </Navbar>
  )
};

export default NavBar;
