import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { Navbar, Nav, Button } from 'react-bootstrap';

function NavBar() {
    const { authState, setAuthState } = useContext(AuthContext);
    const history = useNavigate();
    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ userName: "", id: 0, userSurName: "", userRole: "", userRJ: "", status: false });
        history("/login");
    }

    return (
        /*  <div className="navbar">
         {authState.status ? (
     <>
         {(authState.userRole === "1" || authState.userRole === "2") && (
             <>
                 <Link className="links" to="/">Pregled čitača</Link>
                 <Link className="links" to="/trase">Pregled trasa</Link>
                 <Link className="links" to="/changepassword">Promena lozinke</Link>
                 <Link className="links" to="/registration">Registracija čitača</Link>
                 <Link className="links" to="/registracija-trase">Registracija trase</Link>
                 <Link className="links" to="/unos-stanja">Pregled količina</Link>
                 <Link className="links" to="/admin-stuff">Admin Stuff</Link>
                 <a className="links" href="/adminManual.pdf" target='_blank'>Uputstvo</a>
             </>
         )}
         {authState.userRole === "3" && (
             <>
                 <Link className="links" to="/">Pregled trasa</Link>
                 <Link className="links" to="/changepassword">Promena lozinke</Link>
                 <a className="links" href="/readerManual.pdf" target='_blank'>Uputstvo</a>
             </>
         )}
         <button className='logout' onClick={logout}>Logout</button>
         <h4>Korisnik: {authState.userName}</h4>
         <h4>RJ: {authState.userRJ}</h4>
     </>
 ) : (
     <>
         <Link className="links" to="/login">Login</Link>
         <Link className="links" to="/kalkulator">Kalkulator</Link>
         <Link className="links" to="/havarije">Havarije</Link>
     </>
 )}
     </div> */

        <Navbar expand="lg" className="navbar">
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {authState.status ? (
                        <>
                            {(authState.userRole === "1" || authState.userRole === "2") && (
                                <>
                                    <Nav.Link as={Link} to="/">Pregled čitača</Nav.Link>
                                    <Nav.Link as={Link} to="/trase">Pregled trasa</Nav.Link>
                                    <Nav.Link as={Link} to="/changepassword">Promena lozinke</Nav.Link>
                                    <Nav.Link as={Link} to="/registration">Registracija čitača</Nav.Link>
                                    <Nav.Link as={Link} to="/registracija-trase">Registracija trase</Nav.Link>
                                    <Nav.Link as={Link} to="/unos-stanja">Pregled količina</Nav.Link>
                                    <Nav.Link as={Link} to="/admin-stuff">Admin Stuff</Nav.Link>
                                    <Nav.Link href="/adminManual.pdf" target="_blank">Uputstvo</Nav.Link>
                                </>
                            )}
                            {authState.userRole === "3" && (
                                <>
                                    <Nav.Link as={Link} to="/">Pregled trasa</Nav.Link>
                                    <Nav.Link as={Link} to="/changepassword">Promena lozinke</Nav.Link>
                                    <Nav.Link href="/readerManual.pdf" target="_blank">Uputstvo</Nav.Link>
                                </>
                            )}
                            <Button variant="outline-danger" className='logout' onClick={logout}>Logout</Button>
                            <Navbar.Text className="ml-auto user-info">
                                Korisnik: {authState.userName} | RJ: {authState.userRJ}
                            </Navbar.Text>
                        </>
                    ) : (
                        <>
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
