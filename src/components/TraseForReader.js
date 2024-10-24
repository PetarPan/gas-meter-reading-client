import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function TraseForReader() {
    const [uniqueTrases, setUniqueTrases] = useState([]);
    const { authState, setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authState.userRole !== "3") {
            navigate('/login');
        }
    }, [authState, navigate]);

    useEffect(() => {
        axios.get('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase')
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

    const handleToggle = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await axios.put("http://localhost:3001/users/toggleStatus", {}, {
                headers: {
                    accessToken: accessToken  // Token za autentifikaciju
                }
            });


            // Ažuriraj authState nakon uspešnog odgovora
            const newStatus = authState.userStatus === 'Da' ? 'Ne' : 'Da';
            setAuthState((prevState) => ({
                ...prevState,
                userStatus: newStatus,  // Promeni userStatus odmah na frontend-u
            }));
            alert(response.data.message);  // Notifikacija korisniku
        } catch (error) {
            console.error("Greška prilikom ažuriranja statusa:", error);
            alert("Došlo je do greške pri ažuriranju statusa.");
        }
    };




    return (
        <>
            {authState.userRole === "3" ? (
                <HelmetProvider>
                    <Helmet>
                        <title>Pregled pripadajućih trasa</title>
                    </Helmet>
                    <InputMeterStateSt>
                        <h2>Lista trasa za očitavanje</h2>

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
                        <div>
                            <h3>Status očitavanja:</h3>
                            <p className='verification-st'>Status očitavanja, odnosno verifikacije na početku očitavanja je podešen na vrednost
                                "Ne", tek nakon završetka očitavanja, unosa količina i kontrole istih  postavljate status na "Da", odnosno klikom na dugme   =&gt;Verifikuj&lt;=
                                vršite
                                verifikaciju unesenih količina, odnosno očitavanja.</p>
                            <p className='verification-st'>Verifikaciju očitavanja ne vršite sve dok ne budete sigurni da ste završili sa unosom svih očitanih količina!</p>
{/*                             <p className='verification-st'>Verifikovano očitavanje: {authState.userStatus}</p>
 */}
                            <button className='verification-st ver-btn' onClick={handleToggle}>Verifikuj</button>
                           
                        </div>
                    </InputMeterStateSt>
                </HelmetProvider>
            ) : (
                navigate("/login")
            )}
        </>
    );
}

export default TraseForReader;
