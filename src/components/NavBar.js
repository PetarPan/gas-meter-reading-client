import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function NavBar() {
    const { authState, setAuthState } = useContext(AuthContext);
    const history = useNavigate();
    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, userSurName: "", userRole: "", userRJ: "", status: false });
        history("/login");
    }
   
    return (
        <div className="navbar">
        {authState.status ? (
    <>
        {(authState.userRole === "1" || authState.userRole === "2") && (
            <>
                <Link className="links" to="/">Pregled čitača</Link>
                <Link className="links" to="/trase">Pregled trasa</Link>
                <Link className="links" to="/changepassword">Promena lozinke</Link>
                <Link className="links" to="/registration">Registracija čitača</Link>
                <Link className="links" to="/registracija-trase">Registracija trase</Link>
                <Link className="links" to="/unos-stanja">Pregled unesenih količina</Link>
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
        <button onClick={logout}>Logout</button>
        <h4>Korisnik: {authState.username}</h4>
        <h4>Prezime: {authState.userSurName}</h4>
        <h4>Rola: {authState.userRole}</h4>
        <h4>RJ: {authState.userRJ}</h4>
    </>
) : (
    <>
        <Link className="links" to="/login">Login</Link>
        <Link className="links" to="/kalkulator">Kalkulator</Link>
        <Link className="links" to="/havarije">Havarije</Link>
    </>
)}

    </div>
    );
}

export default NavBar;
