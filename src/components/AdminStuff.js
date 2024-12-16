import React, { useState } from 'react';
import axios from 'axios';
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReadStatus from './ReadStatus';

function AdminStuff() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    // Funkcija za resetovanje statusa svih korisnika
    const resetUserStatus = async () => {
        setLoading(true);
        setError(null); // Resetovanje greške pre nego što pokušamo
        try {
            // Poziv nove rute za resetovanje statusa
            const response = await axios.put('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/resetStatus');
            setMessage(response.data.message); // Prikazivanje poruke
        } catch (err) {
            setError('Došlo je do greške prilikom resetovanja statusa čitača.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //funkcija za reset statusa očitavanja

    return (
        <HelmetProvider>
         <Helmet>
          <title>Reset statusa očitavanja</title>
        </Helmet>
        <div>
            <h1>Reset statusa očitavanja na početne vrednosti:</h1>
            <button onClick={resetUserStatus} disabled={loading}>
                {loading ? 'Resetujem...' : 'Resetuj'}
            </button>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div>
            Promena statusa očitavanja:
            <div>
                <ReadStatus />
            </div>
        </div>
        </HelmetProvider>
    );
}

export default AdminStuff;
