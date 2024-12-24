import React, { useState } from 'react';
import axios from 'axios';
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReadStatus from './ReadStatus';

function AdminStuff( ) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;
    console.log("news url: " + apiUrl);
    console.log("Environment variables:", process.env);
    console.log("API URL in production:", process.env.REACT_APP_API_URL);

    // Funkcija za resetovanje statusa svih korisnika
    const resetUserStatus = async () => {
        setLoading(true);
        setError(null); // Resetovanje greške 
        try {
            // Poziv nove rute za resetovanje statusa
            const response = await axios.put(apiUrl + `/users/resetStatus`);
            setMessage(response.data.message);
        } catch (err) {
            setError('Došlo je do greške prilikom resetovanja statusa čitača.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


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
