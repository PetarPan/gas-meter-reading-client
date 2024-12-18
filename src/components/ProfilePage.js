import React, { useContext, useEffect, useState } from 'react';
import Home from './Home';
import TraseForReader from './TraseForReader';
import { AuthContext } from '../helpers/AuthContext';
import NewsView from './NewsView';

function ProfilePage() {
    const { authState } = useContext(AuthContext);

    return (
        <div>
            {authState.status ? ( // Provera da li je korisnik ulogovan
                authState.userRole === "1" || authState.userRole === "2" ? (
                    <Home />
                ) : authState.userRole === "3" ? (
                    <TraseForReader />
                ) : null
            ) : (
                <>
                    <div className='news'>
                        <h1>Novosti:</h1>
                     
                    </div>
                    <NewsView />
                    
                </>
            )}
        </div>
    );
}

export default ProfilePage;

