import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';


function InputMeterState(/* {apiUrl} */) {
    const [isMobile, setIsMobile] = useState(false);
    const [states, setStates] = useState([]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [newMeterValues, setNewMeterValues] = useState([]);
    const inputRefs = useRef([]);
    const { authState } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstLastRowMessage, setFirstLastRowMessage] = useState('');
    const [status, setStatus] = useState(null); 
    const [showUnread, setShowUnread] = useState(false); 


    const navigate = useNavigate();
    const { id } = useParams();

    const apiUrl = process.env.REACT_APP_API_URL;


    /* useEffect za optimizovani prikaz preko mob/komp */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 820) {
                setIsMobile(true);  // Mobilni uređaji
            } else {
                setIsMobile(false); // Desktop v tablet
            }
        };
        // Pozivamo funkciju odmah nakon rendera
        handleResize();

        // event listener za promenu veličine prozora
        window.addEventListener('resize', handleResize);

        // Uklanjamo listener kada se komponenta uništi
        return () => window.removeEventListener('resize', handleResize);
    }, [])
    /* useEffect za rolu */
    useEffect(() => {
        if (authState.userRole !== "3") {
            navigate('/login');
        }
    }, [authState, navigate]);
    /* useEffect za komunikaciju */
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;

        setLoading(true);
        if (id) {
            axios.get(`${apiUrl}/trase/${id}`)
                .then(response => {
                    setStates(response.data);
                    //setNewMeterValue(response.data.map(() => ''));
                    // Ako ima kupaca u states, postavi prvog kao trenutnog kupca
                    if (response.data.length > 0) {
                        setCurrentCustomer(response.data[0]);  // Postavljamo prvog kupca
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Došlo je do greške!', error);
                    setLoading(false);
                });
        }
    }, [id]);

    //useeffect za prikaz trenutnog statusa očitavanja
    useEffect(() => {
        axios.get(`${apiUrl}/status`)
            .then(response => {
                console.log("Server Response:", response.data); 
                setStatus(response.data.status); 
            })
            .catch((error) => {
                console.error('Greška pri učitavanju statusa:', error);
            });
    }, []);

    const handleKeyDown = (e, rowIndex) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            if (rowIndex < states.length - 1) {
                setSelectedRow(rowIndex + 1);
                inputRefs.current[rowIndex + 1].focus();
            }
        } else if (e.key === 'ArrowUp') {
            if (rowIndex > 0) {
                setSelectedRow(rowIndex - 1);
                inputRefs.current[rowIndex - 1].focus();
            }
        }
    };


    const handleSave = async () => {
        try {
            // Filtriramo samo stanja koja su promenjena
            const updatedStates = states.map((state, index) => ({
                ...state,
                newMeter: newMeterValues[index] || state.newMeter,
            }));

            const statesToSave = updatedStates.filter((state, index) =>
                newMeterValues[index] && newMeterValues[index] !== state.newMeter
            );

            if (statesToSave.length === 0) {
                alert('Nema novih promena za čuvanje.');
                return;
            }

            // Snimamo samo promenjena stanja
            await Promise.all(
                statesToSave.map(async (state) => {
                    await axios.put(`${apiUrl}/trasa/unos/${state.id}`, { newMeter: state.newMeter });
                })
            );

            setStates(updatedStates);
            alert('Unesene vrednosti su uspešno sačuvane.');
        } catch (error) {
            console.error('Došlo je do greške prilikom čuvanja novog stanja:', error);
            alert('Došlo je do greške prilikom čuvanja novog stanja.');
        }
    };


    const handleInputChange = async (e, rowIndex) => {

        const { value } = e.target;
        if (/^-?\d*$/.test(value) || value === "") { // Dozvoljava samo cele brojeve ili prazno
            setNewMeterValues((prevValue) => {
                const newValue = [...prevValue];
                newValue[rowIndex] = value;
                return newValue;
            });
        }
    };

    const handleInputBlur = async (rowIndex) => {

        const newMeterValue = parseInt(newMeterValues[rowIndex]);
        const oldMeterValue = parseInt(states[rowIndex].oldMeter);
        const consumption = newMeterValue - oldMeterValue;

        //potrebno da se prilikom novog ucitavanja i navigacije po tabeli ne bi brisala nova stanja i postavljala Nan...
        if (!isNaN(consumption)) {

        } else {
            return -1
        }
        // Ako je novo stanje manje od starog, prikaži prozor za potvrdu
        if (newMeterValue < oldMeterValue || newMeterValue === null || newMeterValue === isNaN) {

            confirmAlert({
                title: 'Potvrda unosa',
                message: `Uneseno novo stanje (${newMeterValue}) je manje od starog stanja (${oldMeterValue}). Da li želite da nastavite?`,
                buttons: [
                    {
                        label: 'DA',
                        onClick: async () => {
                            // Ako je potvrđeno, ažuriraj stanje i snimi u bazu
                            const consumption = newMeterValue - oldMeterValue;
                            setStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[rowIndex] = {
                                    ...updatedStates[rowIndex],
                                    newMeter: "",
                                    consumption: Math.ceil(consumption),
                                    newMeterOfficial: oldMeterValue,
                                    lessState: newMeterValue
                                    // comment: comment
                                };
                                return updatedStates;
                            });

                            // Snimanje u bazu
                            try {
                                await axios.put(`${apiUrl}/trasa/unos/${states[rowIndex].id}`, { newMeter: newMeterValue, newMeterOfficial: oldMeterValue, lessState: newMeterValue });
                            } catch (error) {
                                console.error('Greška prilikom čuvanja unosa:', error);
                            }
                        }
                    },
                    {
                        label: 'NE',
                        onClick: () => {
                            // Ako je otkazano, ništa se ne menja
                            return -1;
                        }
                    }
                ]
            });
        } else {
            // Ako novo stanje nije manje, automatski se izračunava i snima

            setStates((prevStates) => {
                const updatedStates = [...prevStates];
                updatedStates[rowIndex] = {
                    ...updatedStates[rowIndex],
                    newMeter: newMeterValue,
                    consumption: Math.ceil(consumption),
                    lessState: "",
                    newMeterOfficial: newMeterValue,
                };
                return updatedStates;
            });

            // Snimanje u bazu
            try {
                await axios.put(`${apiUrl}/trasa/unos/${states[rowIndex].id}`, { newMeter: newMeterValue, newMeterOfficial: newMeterValue, lessState: "" });
            } catch (error) {
                console.error('Greška prilikom čuvanja unosa:', error);
            }
        }
    };
    //kraj unosa i čuvanja novog stanja

    const saveComment = async (stateId, comment) => {
        try {
            const updatedStates = states.map((state) => {
                if (state.id === stateId) {
                    return { ...state, comment }; // Ažuriraj samo lokalno
                }
                return state;
            });
            setStates(updatedStates);

            // Umesto da ažurirate sve, šaljite samo za trenutni state
            const stateToUpdate = updatedStates.find(state => state.id === stateId);
            await axios.put(`${apiUrl}/trasa/unos/${stateId}/comment`, { comment: stateToUpdate.comment });

            alert('Komentar je uspešno sačuvan!');
        } catch (error) {
            console.error('Došlo je do greške prilikom čuvanja komentara:', error);
            alert('Došlo je do greške prilikom čuvanja komentara.');
        }
    };

    const handleCommentClick = (stateId) => {
        const comment = prompt("Unesite komentar:");
        if (comment) {
            saveComment(stateId, comment);
        }
    };

    //mobilna verzija
    const inputRef = useRef(null);
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
    //pretraga po broju merila za mobilnu verziju
    // Funkcija za ažuriranje stanja pretrage
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSearchClick = () => {
        if (searchTerm.startsWith("#")) {
            // Pretraga po rednom broju u trasi
            const ordinalToSearch = parseInt(searchTerm.slice(1), 10); // Uklanjamo "#" i konvertujemo u broj

            if (!isNaN(ordinalToSearch) && ordinalToSearch > 0 && ordinalToSearch <= states.length) {
                // Pronalazimo kupca na osnovu rednog broja (indeks u nizu)
                const foundCustomer = states[ordinalToSearch - 1]; // Indeks u nizu je redni broj - 1
                setCurrentCustomer(foundCustomer); // Postavljamo trenutnog kupca
                setCurrentCustomerIndex(ordinalToSearch - 1); // Ažuriramo indeks kupca
            } else {
                alert(`Kupac sa rednim brojem ${ordinalToSearch} nije pronađen u trasi ${id}`);
            }
        } else {
            // Pretraga po broju merila
            const filteredData = states.filter((item) =>
                item.meterId.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredData.length > 0) {
                const foundIndex = states.findIndex(customer => customer.id === filteredData[0].id);

                if (foundIndex !== -1) {
                    setCurrentCustomer(filteredData[0]); // Prikazujemo prvog pronađenog kupca iz `filteredData`
                    setCurrentCustomerIndex(foundIndex); // Postavljamo indeks na mesto tog kupca u `states`
                } else {
                    console.error("Kupac nije pronađen u `states`");
                }
            } else {
                alert(`Traženo merilo nije pronađeno u trasi ${id}`);
                console.error("Nema rezultata pretrage.");
            }
        }
    };
    /* funkcija za postavljanje prikaza na odabrano neocitano MI */
    const handleSelectUnreadUser = (userId) => {
        const foundIndex = states.findIndex((state) => state.id === userId); // Pronalazimo indeks korisnika
        if (foundIndex !== -1) {
            setCurrentCustomer(states[foundIndex]); // Postavljamo trenutnog korisnika
            setCurrentCustomerIndex(foundIndex);   // Ažuriramo indeks
            setShowUnread(false);                  // Zatvaramo prikaz "Neočitani korisnici"
        } else {
            alert("Neočitani korisnik nije pronađen.");
        }
    };

    //kraj pretrage po merilu za mobilnu verziju

    //naivigacija kroz mobilnu verziju


    const handleNavigation = (direction) => {
        if (direction === 'next') {
            if (currentCustomerIndex < states.length - 1) {
                setCurrentCustomerIndex(prevIndex => prevIndex + 1);
                setCurrentCustomer(states[currentCustomerIndex + 1]);
                setFirstLastRowMessage(''); //brisanje poruke u slučaju != prvi/poslednji
                if (inputRef.current) {
                    // inputRef.current.focus(); // Fokusira input polje
                }
            } else {
                setFirstLastRowMessage("Ovo je poslednji kupac u tabeli.");
            }
        } else if (direction === 'prev') {
            if (currentCustomerIndex > 0) {
                setCurrentCustomerIndex(prevIndex => prevIndex - 1);
                setCurrentCustomer(states[currentCustomerIndex - 1]);
                setFirstLastRowMessage(''); //brisanje poruke u slučaju != prvi/poslednji
                if (inputRef.current) {
                    // inputRef.current.focus();
                }
            } else {
                setFirstLastRowMessage("Ovo je prvi kupac u tabeli.");
            }
        }
    };

    //kraj navigacije za mobilnu verziju

    //kontrolisanje unosa u input polje mobilna verzija

    const handleInputChangeMob = async (e, index) => {
        const value = e.target.value;
        // Ažuriramo vrednost newMeter za trenutnog kupca
        setCurrentCustomer(prevState => ({
            ...prevState,
            newMeter: value,  // postavljanje nove vrednosti
        }));
        try {
            // Pozivamo backend API da snimimo novo stanje u bazu
            // await saveNewMeterValue(currentCustomer.id, value);

            // Nakon uspešnog snimanja u bazu, možemo ažurirati i globalno stanje ako je potrebno
            setStates(prevStates =>
                prevStates.map(customer =>
                    customer.id === currentCustomer.id ? { ...customer, newMeter: value } : customer
                )
            );
        } catch (error) {
            console.error("Greška prilikom snimanja novog stanja u bazu:", error);
            // Ovde možeš prikazati obaveštenje korisniku o grešci
        }
    };

    const handleState = async () => {
        try {
            const stateId = currentCustomer.id; // ID trenutnog kupca
            //const currentState = states.find(state => state.id === stateId); // Pronađi trenutno stanje na osnovu ID-a
            const newMeter = currentCustomer.newMeter; // Uzmi novo stanje
            const oldMeter = currentCustomer.oldMeter;
            //const consumption = newMeter - oldMeter;


            console.log(`Ažuriranje podataka za kupca ID: ${stateId} sa novim stanjem: ${newMeter}`);

            if (newMeter < oldMeter) {
                confirmAlert({
                    title: 'Potvrda unosa',
                    message: `Uneseno novo stanje (${newMeter}) je manje od starog stanja (${oldMeter}). Da li želite da nastavite?`,
                    buttons: [
                        {
                            label: 'DA',
                            onClick: async () => {
                                // Ažuriranje stanja u prevStates
                                //newMeterOfficial = oldMeter; // Postavite zvanični novi metar na stari
                                //lessState = newMeter; // Ako je ovo potrebno

                                // Snimanje u bazu
                                try {
                                    const response = await axios.put(`${apiUrl}/trasa/unos/${stateId}`, {
                                        newMeter: newMeter,
                                        newMeterOfficial: oldMeter, // Pošaljite ažurirani zvanični metar
                                        lessState: newMeter // Pošaljite lessState
                                    });

                                    if (response.status === 200) {
                                        handleNavigation('next');
                                    } else {
                                        alert('Došlo je do greške prilikom čuvanja novog stanja.');
                                    }
                                } catch (error) {
                                    console.error('Greška prilikom čuvanja unosa:', error);
                                    alert('Došlo je do greške prilikom čuvanja unosa.');
                                }
                            }
                        },
                        {
                            label: 'NE',
                            onClick: () => {
                                return -1;
                            }
                        }
                    ]
                });
            } else {
                // Ako novo stanje nije manje od starog
                // Snimanje u bazu
                try {
                    const response = await axios.put(`${apiUrl}/trasa/unos/${stateId}`, {
                        newMeter: newMeter,
                        newMeterOfficial: newMeter,
                        lessState: ""
                    });

                    if (response.status === 200) {
                        handleNavigation('next');
                    } else {
                        alert('Došlo je do greške prilikom čuvanja novog stanja.');
                    }
                } catch (error) {
                    console.error('Greška prilikom čuvanja unosa:', error);
                    alert('Došlo je do greške prilikom čuvanja unosa.');
                }
            }
        } catch (error) {
            console.error('Došlo je do greške prilikom čuvanja novog stanja:', error);
            alert('Došlo je do greške prilikom čuvanja novog stanja.');
        }
    };
    //kraj mobilne verzije

    //broj MI, očitani/neočitani...
    const mi = states.filter(MI => MI.name.length > 0);
    const numberMi = mi.length;
    const miRead = states.filter(MI => MI.newMeter.length > 0);
    const numberMiRead = miRead.length;
    const miUnread = numberMi - numberMiRead;

    const readInformation = (
        ` 
        Informacija o ukupnom broju MI, očitano/neočitano:
            Broj MI: ${numberMi}
            Broj očitanih MI: ${numberMiRead}
            Broj neočitanih MI: ${miUnread}
        `
    );
    //kraj broj MI, očitani/neočitani
    return (
        <>

            <HelmetProvider>
                <Helmet>
                    <title>Unos stanja</title>
                </Helmet>
                <InputMeterStateSt>


                    {loading ? (
                        <p>Učitavanje trase, molimo sačekajte...</p>
                    ) : (
                        isMobile ? (
                            <div className="mobile-view">
                                {/* Prikaz za mobilne uređaje */}
                                {currentCustomer && (
                                    <section>
                                        <div className="info-bar">
                                            <h3 className="title">Unos stanja za trasu ID: {id}</h3>
                                            <div className="button-container">
                                                <button className="info-btn" onClick={() => alert(readInformation)}>Info</button>
                                                <button className="unread-btn" onClick={() => setShowUnread(!showUnread)}>Neočitani</button>
                                            </div>
                                        </div>
                                        {/* kontejner za prikaz neočitanih MI */}
                                        {showUnread && (
                                            <div className="unread-MI">
                                                <h4>Neočitani korisnici:</h4>
                                                {states
                                                    .filter((state) => !state.newMeter) // Filtriraj neočitane
                                                    .map((state) => (
                                                        <div
                                                            key={state.id}
                                                            className="unread-item"
                                                            onClick={() => handleSelectUnreadUser(state.id)} // Klik za selektovanje korisnika
                                                            style={{ cursor: "pointer" }} // Stil za vizualni feedback
                                                        >
                                                            <p>Ime i prezime: {state.name}</p>
                                                            <p>Adresa: {state.address}</p>
                                                            <p>Broj merila: {state.meterId}</p>
                                                        </div>
                                                    ))}
                                                {states.filter((state) => !state.newMeter).length === 0 && (
                                                    <p>Nema neočitanih korisnika.</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="user-info-input">
                                            <div className="ugovor">
                                                {/*   {currentCustomer.id} <br /> */}
                                                Redni broj u trasi:
                                                {states.findIndex((state) => state.id === currentCustomer?.id) + 1}
                                                <br />
                                                Broj Ugovora: {currentCustomer.contructNumber}
                                            </div>
                                            <div className="ime">
                                                Ime i prezime: {currentCustomer.name}
                                            </div>
                                            <div className="adresa">
                                                Adresa: {currentCustomer.address}
                                            </div>
                                        </div>
                                        <div className="search">
                                            <label>Pronađi po broju merila: </label>
                                            <input
                                                placeholder="pretraga po broju merila"
                                                value={searchTerm}
                                                onChange={(e) => handleSearchChange(e)}
                                            />
                                            <button onClick={handleSearchClick}>Pronađi</button>
                                        </div>
                                        <div className="input-style">
                                            <div className="merilo">
                                                Broj merila: {currentCustomer.meterId}
                                            </div>
                                            <div className="oldMeter">
                                                Staro stanje: {currentCustomer.oldMeter}
                                            </div>
                                            <div className="newMeter">
                                                Novo uneseno stanje: {currentCustomer.newMeter || "Neočitano"}
                                            </div>
                                            <div className={`consumption ${currentCustomer.newMeter - currentCustomer.oldMeter < 0 ? 'orange'
                                                : currentCustomer.newMeter - currentCustomer.oldMeter > 1500 ? 'red'
                                                    : 'green'}`}>
                                                Potrošnja: {currentCustomer.newMeter - currentCustomer.oldMeter}
                                            </div>
                                            Očitano: {currentCustomer.newMeter ? 'Da' : 'Ne'} |
                                            <label>Unesi novo stanje merila: </label>
                                            <input
                                                className={`${status ? 'visible' : 'hidden'} input-mob-ver`}
                                                ref={inputRef}
                                                type="number"
                                                placeholder="unesite novo stanje merila"
                                                min="0"
                                                step="1"
                                                inputMode="numeric"
                                                pattern="\d"
                                                value={currentCustomer.newMeter || ''}
                                                onChange={(e) => handleInputChangeMob(e)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </div>
                                        <div className="buttons">
                                            <button onClick={() => handleNavigation('prev')}>Prethodni</button>
                                            <button className="state-btn" onClick={handleState}>Unesi stanje</button>
                                            <button onClick={() => handleNavigation('next')}>Sledeći</button>
                                            <br />
                                        </div>
                                        {firstLastRowMessage && <p className="info-message">{firstLastRowMessage}</p>}
                                        <button onClick={() => handleCommentClick(currentCustomer.id)}>Unesi komentar</button>
                                    </section>
                                )}
                            </div>
                        ) : (
                            <div className="desktop-view">
                                <div className="main-title">
                                    {readInformation}
                                    <h2 className="title">Unos stanja za trasu ID: {id}</h2>
                                    <button className="save" onClick={handleSave}>Sačuvaj</button><br />
                                    
                                </div>
                                {states && states.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID Trase</th>
                                                <th>Ugovor</th>
                                                <th>Ime</th>
                                                <th>Adresa</th>
                                                <th>Merilo</th>
                                                <th>Staro stanje</th>
                                                <th className={status ? 'visible' : 'hidden'}>Novo stanje</th>
                                                <th>Potrošnja</th>
                                                <th>Komentar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {states
                                                .slice()
                                                .sort((a, b) => a.id - b.id)
                                                .map((state, index) => (
                                                    <tr key={index} onKeyDown={(e) => handleKeyDown(e, index)}>
                                                        <td>{state.trasaId}</td>
                                                        <td>{state.contructNumber}</td>
                                                        <td>{state.name}</td>
                                                        <td>{state.address}</td>
                                                        <td>{state.meterId}</td>
                                                        <td>{state.oldMeter}</td>
                                                        <td className={status ? 'visible' : 'hidden'}>
                                                            <input
                                                                ref={(el) => (inputRefs.current[index] = el)}
                                                                type="number"
                                                                placeholder="Unesite novo stanje"
                                                                value={newMeterValues[index] || state.newMeter}
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                onBlur={() => handleInputBlur(index)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                                        e.preventDefault();
                                                                    }
                                                                    handleKeyDown(e, index);
                                                                }}
                                                                min="0"
                                                                step="1"
                                                                inputMode="numeric"
                                                                pattern="\d"
                                                            />
                                                        </td>
                                                        <td className={
                                                            (state.newMeter - state.oldMeter) > 1500
                                                                ? 'red'
                                                                : (state.newMeter - state.oldMeter) <= 1500 && (state.newMeter - state.oldMeter) >= 0
                                                                    ? 'green' : (state.newMeter - state.oldMeter) < 0 ? 'orange' : 'white'
                                                        }>
                                                            {state.newMeter - state.oldMeter}
                                                        </td>
                                                        <td>
                                                            <button className="comment" onClick={() => handleCommentClick(state.id)}>Unesi komentar</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Podaci nisu dostupni.</p>
                                )}
                            </div>
                        )
                    )}
                </InputMeterStateSt>
            </HelmetProvider>
        </>
    );
}

export default InputMeterState;
