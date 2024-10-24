import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';


function InputMeterState() {
    const [isMobile, setIsMobile] = useState(false);
    const [states, setStates] = useState([]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [newMeterValues, setNewMeterValues] = useState([]);
    const inputRefs = useRef([]);
    const { authState } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCustomer, setCurrentCustomer] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

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
        if (id) {
            axios.get(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/${id}`)
                .then(response => {
                    setStates(response.data);
                    //setNewMeterValue(response.data.map(() => ''));
                    // Ako ima kupaca u states, postavi prvog kao trenutnog kupca
                    if (response.data.length > 0) {
                        setCurrentCustomer(response.data[0]);  // Postavljamo prvog kupca
                    }
                })
                .catch(error => {
                    console.error('Došlo je do greške!', error);
                });
        }
    }, [id]);

    const handleKeyDown = (e, rowIndex) => {
        if (e.key === 'ArrowDown') {
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
            const updatedStates = states.map((state, index) => ({
                ...state,
                newMeter: newMeterValues[index] || state.newMeter,
            }));
            setStates(updatedStates);

            await Promise.all(
                updatedStates.map(async (state) => {
                    await axios.put(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/unos/${state.id}`, { newMeter: state.newMeter });
                })
            );
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
                                await axios.put(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trasa/unos/${states[rowIndex].id}`, { newMeter: newMeterValue, newMeterOfficial: oldMeterValue, lessState: newMeterValue });
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
                await axios.put(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trasa/unos/${states[rowIndex].id}`, { newMeter: newMeterValue, newMeterOfficial: newMeterValue, lessState: "" });
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
                    return { ...state, comment };
                }
                return state;
            });
            setStates(updatedStates);

            await Promise.all(
                updatedStates.map(async (state) => {
                    await axios.put(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trasa/unos/${state.id}`, { comment: state.comment });
                })
            );
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
           // Pretraga po ID-u
        const idToSearch = searchTerm.slice(1); // Skidamo prefiks #

        // Pronalazimo kupca po ID-u
        const foundCustomer = states.find(customer => customer.id.toString() === idToSearch);

        if (foundCustomer) {
            setCurrentCustomer(foundCustomer); // Prikazujemo kupca po ID-u
            const foundIndex = states.indexOf(foundCustomer); // Pronalazimo indeks kupca u `states`
            setCurrentCustomerIndex(foundIndex); // Postavljamo indeks kupca
        } else {
            alert(`Kupac sa ID-jem ${idToSearch} nije pronađen u trasi ${id}`);
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
    
    //kraj pretrage po merilu za mobilnu verziju

    //naivigacija kroz mobilnu verziju


    const handleNavigation = (direction) => {
        if (direction === 'next' && currentCustomerIndex < states.length - 1) {
            setCurrentCustomerIndex(prevIndex => prevIndex + 1);
            setCurrentCustomer(states[currentCustomerIndex + 1]);
            if (inputRef.current) {
                //inputRef.current.focus(); // Fokusira input polje
            }
        } else if (direction === 'prev' && currentCustomerIndex > 0) {
            setCurrentCustomerIndex(prevIndex => prevIndex - 1);
            setCurrentCustomer(states[currentCustomerIndex - 1]);
            if (inputRef.current) {
                //inputRef.current.focus();
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
                                    const response = await axios.put(`http://localhost:3001/trasa/unos/${stateId}`, {
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
                    const response = await axios.put(`http://localhost:3001/trasa/unos/${stateId}`, {
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

                    {isMobile ? (

                        <div className="mobile-view">
                            {/* Prikaz za mobilne uređaje */}
                            {/* prikaz ocitanih, neocitanih i ukupnog broja MI */}

                            {currentCustomer && (

                                <section>
                                    <div>
                                        <h3 className="title">Unos stanja za trasu ID: {id}</h3>

                                        <button className="info-btn" onClick={() => { alert(readInformation) }}>Info</button>
                                    </div>
                                    <div className="user-info-input">
                                        <div className="ugovor">
                                            Redni broj u trasi: {currentCustomer.id} <br></br>
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
                                            onChange={(e) => handleSearchChange(e)} // Ažurira searchTerm prilikom unosa
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
                                        {/* Ukoliko je MI neočitano info neočitano : novo stanje */}
                                        <div className="newMeter">
                                            Novo uneseno stanje:   {currentCustomer.newMeter ? currentCustomer.newMeter : "Neočitano"}
                                        </div>
                                        {/*  <div className="consumption">
                                        Potrošnja: {currentCustomer.newMeter - currentCustomer.oldMeter}
                                    </div> */}
                                        <div className={`consumption ${currentCustomer.newMeter - currentCustomer.oldMeter < 0 ? 'orange'
                                            : currentCustomer.newMeter - currentCustomer.oldMeter > 1500 ? 'red'
                                                : 'green'}`}>
                                            Potrošnja: {currentCustomer.newMeter - currentCustomer.oldMeter}
                                        </div>
                                        Očitano: {currentCustomer.newMeter ? 'Da | ' : 'Ne | '} <label>Unesi novo stanje merila: </label>
                                        <input
                                            ref={inputRef}
                                            type="number"
                                            placeholder="unesite novo stanje merila"
                                            min='0'
                                            step='1'
                                            inputMode="numeric"
                                            pattern="\d"
                                            value={currentCustomer.newMeter || ''}
                                            onChange={(e) => handleInputChangeMob(e)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                    <div className="buttons">
                                        <button onClick={() => handleNavigation('prev')}>Prethodni</button>
                                        {/*                                         <button className="nav-btn" onClick={handlePrevious}>Prethodni kupac</button>
 */}                                        <button className="state-btn" onClick={handleState}>Unesi stanje</button>
                                        {/*                                         <button className="nav-btn" onClick={handleNext}>Sledeći kupac</button>
 */}

                                        <button onClick={() => handleNavigation('next')}>Sledeći</button>
                                        <br />
                                    </div>
                                    {/* dugme za prompt unos komentara */}

                                    <button onClick={() => handleCommentClick(currentCustomer.id)}>Unesi komentar</button>
                                </section>
                            )}
                        </div>
                    ) : (
                        <div className="desktop-view">
                            {/* Prikaz za desktop */}
                            <div className='main-title'>
                                {/* prikaz ukupnog broja MI, očitanih/neočitanih */}
                                {readInformation}
                                <h2 className="title">Unos stanja za trasu ID: {id}</h2>

                                {/* dugme za čuvanje unesenih vrednosti u kolonu Novo stanje */}
                                <button className='save' onClick={handleSave}>Sačuvaj</button> <br />
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
                                            <th>Novo stanje</th>
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
                                                    {/* <td>{state.newMeter}</td> */}

                                                    <td>
                                                        <input
                                                            ref={(el) => (inputRefs.current[index] = el)}
                                                            type="number"
                                                            placeholder="Unesite novo stanje"
                                                            value={newMeterValues[index] || state.newMeter}
                                                            onFocus={(e) => e.target.select()}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            onBlur={(e) => { handleInputBlur(index) }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                                    e.preventDefault(); // Sprečava promenu vrednosti
                                                                }
                                                                handleKeyDown(e, index); // Poziva funkciju za navigaciju
                                                            }}
                                                            min='0'
                                                            step='1'
                                                            inputMode="numeric"
                                                            pattern="\d"
                                                        />
                                                    </td>
                                                    <td className={
                                                        (state.newMeter - state.oldMeter) > 1500
                                                            ? 'red'
                                                            : (state.newMeter - state.oldMeter) <= 1500 && (state.newMeter - state.oldMeter) >= 0
                                                                ? 'green' : (state.newMeter - state.oldMeter) < 0 ? 'orange' :
                                                                    (state.newMeter) ? 'white'
                                                                        : 'white'
                                                    }>{state.newMeter - state.oldMeter}</td>
                                                   
                                                    <td>
                                                        <button onClick={() => handleCommentClick(state.id)}>Unesi komentar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Podaci nisu dostupni.</p>
                            )}
                        </div>
                    )}

                </InputMeterStateSt>
            </HelmetProvider>
        </>
    );
}

export default InputMeterState;
