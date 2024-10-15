import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function TraseForReader() {
    const [uniqueTrases, setUniqueTrases] = useState([]);
    const { authState } = useContext(AuthContext);
    //const [toggle, setToggle] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (authState.userRole !== "3") {
            navigate('/login');
        }
    }, [authState, navigate]);

    useEffect(() => {
        axios.get('http://localhost:3001/trase')
            .then(response => {
                // Izdvoj jedinstvene trase
                const uniqueTrasesMap = new Map();
                response.data.forEach(item => {
                    if (!uniqueTrasesMap.has(item.trasaId)) {
                        uniqueTrasesMap.set(item.trasaId, {
                            trasaId: item.trasaId,
                            trasaName: item.trasaName,
                            trasaName2: item.trasaName2,
                            readerId: item.readerId,
                            RJ: item.RJ,
                        });
                    }
                });

                // Dobavi RJ za svaku jedinstvenu trasu
                const uniqueTrasesWithRJ = Array.from(uniqueTrasesMap.values());
                setUniqueTrases(uniqueTrasesWithRJ.filter(trase => trase.readerId === authState.id));
            })
            .catch(error => {
                console.error('There was an error fetching trase:', error);
            });
    }, [authState.id]);

    const handleTrasaClick = (selectedTrasaId) => {
        navigate(`/unos-stanja/${selectedTrasaId}`);
    };

    //promena statusa očitavanja

    /* const handleToggle = () => {
        const newStatus = toggle === 0 ? 1 : 0; 
        setToggle(newStatus);

        axios.put('http://localhost:3001/trase', {status: newStatus})
        .then(res => {
            alert('Status očitavanja uspešno ažuriran');            
        })
        .catch(err => {
            console.log('Došlo je do greške prilikom ažuriranja statusa:', err);
            
        })
    } */

    return (
        <>
            {authState.userRole === "3" ? (
                <HelmetProvider>
                    <Helmet>
                        <title>Pregled pripadajućih trasa</title>
                    </Helmet>
                    <InputMeterStateSt>
                        <h2>Lista trasa za očitavanje</h2>
                       {/*  <button onClick={handleToggle}>
                            {toggle === 0 ? 'U procesu očitavanja' : 'Završeno očitavanje'}
                        </button> */}                        
                    <table>
                            <thead>
                                <tr>
                                    <th>Trasa ID</th>
                                    <th>Trasa Name</th>
                                    <th>Trasa Name 2</th>
                                    <th>Reader ID</th>
                                    <th>RJ</th>

                                </tr>
                            </thead>
                            <tbody>
                                {uniqueTrases.map((trase, index) => (
                                    <tr key={index} onClick={() => handleTrasaClick(trase.trasaId)}>
                                        <td>{trase.trasaId}</td>
                                        <td>{trase.trasaName}</td>
                                        <td>{trase.trasaName2}</td>
                                        <td>{trase.readerId}</td>
                                        <td>{trase.RJ}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </InputMeterStateSt>
                </HelmetProvider>
            ) : (
                navigate("/login")
            )}
        </>
    );
}

export default TraseForReader;
