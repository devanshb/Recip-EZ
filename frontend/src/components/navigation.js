import {Nav, Navbar, NavDropdown, Container} from 'react-bootstrap'
import React, { useState, useEffect} from 'react';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div className="NavbarContainer">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand className="NavbarBrand">RECIP-EZ</Navbar.Brand>
          <Nav className="ml-auto">
            {isAuth ? (
              <>
                <Nav.Link href="/AboutUs" className="NavLink">
                  About Us
                </Nav.Link>
                <Nav.Link href="/logout" className="NavLink">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href="/signup" className="NavLink">
                Signup
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>

  )
}