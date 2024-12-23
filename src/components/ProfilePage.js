import React, { useContext } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import Home from './Home';
import NewsView from './NewsView';
import PreLoginPage from './PreLoginPage';

function ProfilePage() {
    const { authState } = useContext(AuthContext);

    return (
        <div>
            {authState.status ? ( // Provera da li je korisnik ulogovan
                authState.userRole === "1" || authState.userRole === "2" ? (
                    <Home />
                ) : authState.userRole === "3" ? (
                    <NewsView />
                ) : null
            ) : (
                <>
                    <div className='news'>
                        <h1>Novosti:</h1>
                     
                    </div>
                    <PreLoginPage />
                    
                </>
            )}
        </div>
    );
}

export default ProfilePage;

