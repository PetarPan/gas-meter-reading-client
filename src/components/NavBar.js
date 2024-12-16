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
                                <Nav.Link as={Link} to="/">Pregled čitača</Nav.Link>
                                <Nav.Link as={Link} to="/trase">Pregled trasa</Nav.Link>
                                <Nav.Link as={Link} to="/changepassword">Promena lozinke</Nav.Link>
                                <Nav.Link as={Link} to="/registration">Registracija čitača</Nav.Link>
                                <Nav.Link as={Link} to="/registracija-trase">Registracija trase</Nav.Link>
                                <Nav.Link as={Link} to="/news-create">Vesti</Nav.Link>
                                <Nav.Link as={Link} to="/faq-create">FAQs</Nav.Link>
                                <Nav.Link as={Link} to="/admin-stuff">Admin Stuff</Nav.Link>
                                <Nav.Link href="/adminManual.pdf" target="_blank">Uputstvo</Nav.Link>
                            </>
                        )}
                        {(authState.userRole === "2") && (
                            <>
                                <Nav.Link as={Link} to="/">Pregled čitača</Nav.Link>
                                <Nav.Link as={Link} to="/trase">Pregled trasa</Nav.Link>
                                <Nav.Link as={Link} to="/changepassword">Promena lozinke</Nav.Link>
                                <Nav.Link as={Link} to="/registration">Registracija čitača</Nav.Link>
                                <Nav.Link as={Link} to="/registracija-trase">Registracija trase</Nav.Link>
                                <Nav.Link as={Link} to="/unos-stanja">Pregled količina</Nav.Link>
                                <Nav.Link href="/adminManual.pdf" target="_blank">Uputstvo</Nav.Link>
                            </>
                        )}
                        {authState.userRole === "3" && (
                            <>
                                <Nav.Link as={Link} to="/">Pregled trasa</Nav.Link>
                                <Nav.Link as={Link} to="/changepassword">Promena lozinke</Nav.Link>
                                <Nav.Link href="/readerManual.pdf" target="_blank">Uputstvo</Nav.Link>
                                <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                            </>
                        )}
                        <Button variant="outline-danger" className='logout' onClick={logout}>Logout</Button>
                        
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to="/">Početna</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/kalkulator">Kalkulator</Nav.Link>
                        <Nav.Link as={Link} to="/havarije">Havarije</Nav.Link>
                        <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                    </>
                )}
            </Nav>
        </Navbar.Collapse>
    </Navbar>


    );
}

export default NavBar;
