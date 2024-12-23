import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { Navbar, Nav, Button } from 'react-bootstrap';

function NavBar() {
    const { authState, setAuthState } = useContext(AuthContext);
    const history = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ userName: "", id: 0, userSurName: "", userRole: "", userRJ: "", status: false });
        history("/login");
    }

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    }

    return (
        
        <Navbar expand="lg" className="navbar">
       <Navbar.Text className="ml-auto user-info">
    {authState.userRole && (
        <>
            Korisnik: {authState.userName} | RJ: {authState.userRJ}
        </>
    )}
</Navbar.Text>

        {/* Burger meni dugme */}
        <button className="burger-menu" onClick={toggleMenu}>
            &#9776; {/* Hamburger icon */}
        </button>

        <Navbar.Collapse id="basic-navbar-nav" className={isMenuOpen ? 'open' : ''}>
    <Nav className="me-auto">
        {authState.status ? (
            <>
                {(authState.userRole === "1") && (
                    <>
                        <Nav.Link as={Link} to="/" onClick={() => setMenuOpen(false)}>Pregled čitača</Nav.Link>
                        <Nav.Link as={Link} to="/trase" onClick={() => setMenuOpen(false)}>Pregled trasa</Nav.Link>
                        <Nav.Link as={Link} to="/changepassword" onClick={() => setMenuOpen(false)}>Promena lozinke</Nav.Link>
                        <Nav.Link as={Link} to="/registration" onClick={() => setMenuOpen(false)}>Registracija čitača</Nav.Link>
                        <Nav.Link as={Link} to="/registracija-trase" onClick={() => setMenuOpen(false)}>Registracija trase</Nav.Link>
                        <Nav.Link as={Link} to="/news-create" onClick={() => setMenuOpen(false)}>Vesti</Nav.Link>
                        <Nav.Link as={Link} to="/faq-create" onClick={() => setMenuOpen(false)}>FAQs</Nav.Link>
                        <Nav.Link as={Link} to="/admin-stuff" onClick={() => setMenuOpen(false)}>Admin Stuff</Nav.Link>
                        <Nav.Link href="/adminManual.pdf" target="_blank" onClick={() => setMenuOpen(false)}>Uputstvo</Nav.Link>
                    </>
                )}
                {(authState.userRole === "2") && (
                    <>
                        <Nav.Link as={Link} to="/" onClick={() => setMenuOpen(false)}>Pregled čitača</Nav.Link>
                        <Nav.Link as={Link} to="/trase" onClick={() => setMenuOpen(false)}>Pregled trasa</Nav.Link>
                        <Nav.Link as={Link} to="/changepassword" onClick={() => setMenuOpen(false)}>Promena lozinke</Nav.Link>
                        <Nav.Link as={Link} to="/registration" onClick={() => setMenuOpen(false)}>Registracija čitača</Nav.Link>
                        <Nav.Link as={Link} to="/registracija-trase" onClick={() => setMenuOpen(false)}>Registracija trase</Nav.Link>
                        <Nav.Link as={Link} to="/unos-stanja" onClick={() => setMenuOpen(false)}>Pregled količina</Nav.Link>
                        <Nav.Link href="/adminManual.pdf" target="_blank" onClick={() => setMenuOpen(false)}>Uputstvo</Nav.Link>
                        <Nav.Link as={Link} to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Nav.Link>

                    </>
                )}
                {authState.userRole === "3" && (
                    <>
                        <Nav.Link as={Link} to="/" onClick={() => setMenuOpen(false)}>Početna strana</Nav.Link>
                        <Nav.Link as={Link} to="/pregled-trasa-citaci" onClick={() => setMenuOpen(false)}>Pregled trasa</Nav.Link>
                        <Nav.Link as={Link} to="/changepassword" onClick={() => setMenuOpen(false)}>Promena lozinke</Nav.Link>
                        <Nav.Link href="/readerManual.pdf" target="_blank" onClick={() => setMenuOpen(false)}>Uputstvo</Nav.Link>
                        <Nav.Link as={Link} to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Nav.Link>
                    </>
                )}
                <Button variant="outline-danger" className='logout' onClick={() => {
                    logout();
                    setMenuOpen(false);
                }}>Logout</Button>
            </>
        ) : (
            <>
                <Nav.Link as={Link} to="/" onClick={() => setMenuOpen(false)}>Početna</Nav.Link>
                <Nav.Link as={Link} to="/login" onClick={() => setMenuOpen(false)}>Login čitača</Nav.Link>
                <Nav.Link as={Link} to="/kalkulator" onClick={() => setMenuOpen(false)}>Kalkulator</Nav.Link>
                <Nav.Link as={Link} to="/havarije" onClick={() => setMenuOpen(false)}>Havarije</Nav.Link>
            </>
        )}
    </Nav>
</Navbar.Collapse>

    </Navbar>


    );
}

export default NavBar;
