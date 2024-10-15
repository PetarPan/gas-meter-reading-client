import React, { useContext } from 'react';
import Home from './Home';
import TraseForReader from './TraseForReader';
import { AuthContext } from '../helpers/AuthContext';

function ProfilePage() {
    const { authState } = useContext(AuthContext);

    return (
        <div>
            {authState.userRole === "1" || authState.userRole === "2" ? (
                <Home />
            ) : authState.userRole === "3" ? (
                <TraseForReader />
            ) : null}
        </div>
    );
}

export default ProfilePage;

