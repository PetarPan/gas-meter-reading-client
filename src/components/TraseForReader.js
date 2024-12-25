import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function TraseForReader({apiUrl} ) {
    const [uniqueTrases, setUniqueTrases] = useState([]);
    const { authState, setAuthState } = useContext(AuthContext);
    const [status, setStatus] = useState(null); //prikaz statusa očitavanja za visible:hidden kolone

    //const apiUrl = process.env.REACT_APP_API_URL;


    const navigate = useNavigate();

    useEffect(() => {
        if (authState.userRole !== "3") {
            navigate('/login');
        }
    }, [authState.userRole, navigate]);

    useEffect(() => {
        axios.get(apiUrl + `/trase`)
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
                setUniqueTrases(uniqueTrasesWithRJ.filter(trase => trase.readerId === Number(authState.userId)));
            })
            .catch(error => {
                console.error('There was an error fetching trase:', error);
            });
    }, [Number(authState.userId)]);

    const handleTrasaClick = (selectedTrasaId) => {
        console.log("Navigating to trasa ID:", selectedTrasaId);  // Dodajte log za debugovanje
        navigate(`/unos-stanja/${selectedTrasaId}`);    
    };


    useEffect(() => {

        axios.get(apiUrl + `/status`)
            .then(response => {
                console.log("Server Response:", response.data); 
                setStatus(response.data.status);
            })
            .catch((error) => {
                console.error('Greška pri učitavanju statusa:', error);
            });
    }, []);
    //promena user statusa očitavanja

    const handleToggle = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            const response = await axios.put(
                apiUrl + `/users/toggleStatus`,
                {}, 
                {
                    headers: {
                        accessToken: accessToken 
                    },
                    withCredentials: true
                }
            );
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
           
                <HelmetProvider>
                    <Helmet>
                        <title>Pregled pripadajućih trasa</title>
                    </Helmet>
                    <InputMeterStateSt>
                        <div className={`${status ? 'visible' : 'hidden'} input-mob-ver`}>
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
                        </div>
                        <div className={`${status ? 'hidden' : 'visible'} input-mob-ver`}>
                            <p>Datum za očitavanje potrošnje još uvek nije otvoren ili je očitavanje završeno.</p>
                            <p>Molimo , vodite računa o dostavljenim rokovima koje dobijate mejlom i putem stranice Novosti na aplikaciji.</p>
                            <p>Ukoliko je očitavanje u toku, a ne vidite svoje trase obratite se korisničkoj podršci.</p>
                        </div>
                    </InputMeterStateSt>
                </HelmetProvider>
          
        </>
    );
}

export default TraseForReader;
