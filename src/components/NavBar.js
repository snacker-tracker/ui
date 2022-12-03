import React from "react";
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavItem from 'react-bootstrap/NavItem'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'

//import { LocationContext } from '../lib/LocationContext'

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
          <Dropdown drop="down">
              <LocationContext.Consumer>
                  {location => (
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {location}
                    </Dropdown.Toggle>
                  )}
            </LocationContext.Consumer>

            <Dropdown.Menu>
                <Dropdown.Item to="?location=thailand:bangkok" as={NavLink}>Thailand</Dropdown.Item>
                <Dropdown.Item to="?location=singapore" as={NavLink}>Singapore</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
