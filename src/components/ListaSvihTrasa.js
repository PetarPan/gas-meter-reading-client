import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const ListaSvihTrasa = () => {
    const [trase, setTrase] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/trase/lista-svih-trasa')
            .then(response => {
                setTrase(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <HelmetProvider>
        <Helmet>
            <title>Lista trasa</title>
        </Helmet>
        <div>
            <h1>Lista Trasa</h1>
            <ul>
                {trase.map(trasa => (
                    <li key={trasa.id}>
                       RJ: {trasa.RJ} - Adresa: {trasa.address} - Ugovor: {trasa.constructNumber} - Merilo {trasa.meterId}
                    </li>
                ))}
            </ul>
        </div>
        </HelmetProvider>
    );
};

export default ListaSvihTrasa;
