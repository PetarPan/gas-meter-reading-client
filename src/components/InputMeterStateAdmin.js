import axios from 'axios';
import React, { useEffect, useState, useRef, useContext } from 'react';
import InputMeterStateSt from "../styledComponents/InputMeterStateSt.style"
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";

import { confirmAlert } from 'react-confirm-alert'; // Import


function InputMeterStateAdmin({apiUrl}) {
    const [states, setStates] = useState([]);
    const [selectedRow, setSelectedRow] = useState(0);
    const [newMeterValues, setNewMeterValues] = useState([]);
    const inputRefs = useRef([]);
    const { authState } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    //filter search filter 
    const [searchTerm, setSearchTerm] = useState('');
    //pretraga po RJ, broju Ugovora, broju merila
    const filteredData = states.filter((item) =>
        item.contructNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.RJ.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meterId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.readerId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trasaId.toString().includes(searchTerm.toLowerCase())

    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    // kraj filtera search

    //pocetak sort funkcije
    const [sortOrder, setSortOrder] = useState('');

    const handleSort = () => {
        const sortedData = [...states].sort((a, b) => {
            const aValue = parseFloat(a.newMeter) - parseFloat(a.oldMeter) || 0; // Konvertuj u broj ili postavi na 0
            const bValue = parseFloat(b.newMeter) - parseFloat(b.oldMeter) || 0; // Isto kao gore

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });
        setStates(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    //kraj sort funkcije

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiUrl}/trasa/unos`)
            .then(response => {
                setStates(response.data);
                // setNewMeterValues(response.data.map(() => ''));
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error!', error);
                setLoading(false);
            });
    }, [authState]);
    useEffect(() => {
        if (authState.userRole == 1 || authState.userRole == 2) {
            history('/unos-stanja');
        } else {
            history('/login');
        }
    }, [authState.userRole, history])

    //funkcija za navigaciju strelicama
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
    //unos i čuvanje novog stanja
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
        if (newMeterValue < oldMeterValue) {


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
    //unos i čuvanje komentara početak
    const handleCommentClick = (stateId) => {
        const comment = prompt("Unesite komentar:");
        if (comment) {
            saveComment(stateId, comment);
        }
    };

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



    //unos i čuvanje komentara kraj

    //izvoz ocitanih kolicina za uvoz...
    const headersQuantities = [
        { label: "TRASE_ID", key: "trasaId" },
        { label: "SIFRA", key: "contructNumber" },
        { label: "MERAC_SER_BROJ", key: "meterId" },
        { label: "STARO_STANJE", key: "oldMeter" },
        { label: "NOVO_STANJE", key: "newMeterOfficial" }
    ]
    //izvoz MI sa manjim stanjima 
    const headersLessState = [
        { label: "ID Trase", key: "trasaId" },
        { label: "Ugovor", key: "contructNumber" },
        { label: "Merilo", key: "meterId" },
        { label: "Staro Stanje", key: "oldMeter" },
        { label: "Manje Stanje", key: "lessState" },
        { label: "Novo Stanje", key: "newMeter" },
        { label: 'Čitač', key: 'readerid' }
    ]
    //izvoz neocitanih MI
    const headersUnread = [
        { label: "ID Trase", key: "trasaId" },
        { label: "Ugovor", key: "contructNumber" },
        { label: "Merilo", key: "meterId" },
        { label: "Staro Stanje", key: "oldMeter" },
        { label: "Novo Stanje", key: "newMeter" },
        { label: 'Čitač', key: 'readerid' }
    ]
    //izvoz podataka sa komentarima
    const headersComment = [
        { label: "ID Trase", key: "trasaId" },
        { label: "Ugovor", key: "contructNumber" },
        { label: "Merilo", key: "meterId" },
        { label: "Staro Stanje", key: "oldMeter" },
        { label: "Manje Stanje", key: "lessState" },
        { label: "Novo Stanje", key: "newMeter" },
        { label: 'Komentar', key: 'comment' }
    ]


    //broj MI, očitani/neočitani...
    const mi = filteredData.filter(MI => MI.name.length > 0);
    const numberMi = mi.length;
    const miRead = filteredData.filter(MI => MI.newMeterOfficial.length > 0);
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
    return (
        <HelmetProvider>
            {/* Helmet - naziv kartice u pregledaču */}
            <Helmet>
                <title>Pregled količina</title>
            </Helmet>

            <InputMeterStateSt>
                {loading ? (
                    <p>Učitavanje podataka, molimo sačekajte...</p>
                ) : (
                    <>
                        <div className='main-title'>
                            <div className='read-information'>
                            </div>

                            <h2 className='title'>Unos stanja</h2>
                            {/* search input */}
                            <div>
                                <label>Pretraga po broju Ugovora, nazivu kupca, adresi i broju merila: </label>
                                <input
                                    type="text"
                                    placeholder="Unesite željeni parametar za pretragu"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            {/* export u csv */}
                            <div className='button-csv'>
                                {/* dugme za preuzimanje unesenih/očitanih količina za sve trase sa potrebnim poljima za uvoz u orakl */}

                                <button className='export-csv'>
                                    <CSVLink
                                        data={states.filter(
                                            (state) =>
                                                state.newMeterOfficial && // Proverava da li `newMeterOfficial` postoji
                                                state.newMeterOfficial.length > 0 && // Proverava da li `newMeter` nije prazan
                                                state.RJ.toLowerCase() === authState.userRJ.toLowerCase() // Proverava da li `state.RJ` odgovara `authState.userRJ`
                                        )}

                                        headers={headersQuantities}
                                        filename={"očitavanja.csv"}
                                        target="_blank"
                                    >
                                        Preuzmi očitane količine
                                    </CSVLink></button>
                                {/* dugme za preuzimanje neočitanih MI */}
                                <button className='export-csv'>
                                    <CSVLink
                                        data={states.filter(
                                            (state) =>
                                                state.newMeter == "" && //provera polja bez unesenihi kolicina
                                                state.RJ.toLowerCase() === authState.userRJ.toLowerCase() // Proverava da li `state.RJ` odgovara `authState.userRJ`                                               
                                        )}
                                        headers={headersUnread}
                                        filename={"Neočitana-MI.csv"}
                                        target="_blank"
                                    >
                                        Neočitana MI
                                    </CSVLink>
                                </button>
                                {/* dugme za preuzimanje MI sa unesenim manjim novim stanjima u odnosu na stara za ispravku nakon obračuna */}

                                <button className='export-csv'>
                                    <CSVLink
                                        data={states.filter(
                                            (state) =>
                                                state.lessState > 0 && //Provera i eksport manjih stanja
                                                state.RJ.toLowerCase() === authState.userRJ.toLowerCase() // Proverava da li `state.RJ` odgovara `authState.userRJ`
                                        )}
                                        headers={headersLessState}
                                        filename={"Manja-stanja-MI.csv"}
                                        target="_blank"
                                    >
                                        Preuzmi MI sa manjim stanjima
                                    </CSVLink>
                                </button>
                                <button className='export-csv'>
                                    <CSVLink
                                        data={states.filter(
                                            (state) =>
                                                state.comment && //provera da li postoji komentar u polju 
                                                state.RJ.toLowerCase() === authState.userRJ.toLowerCase() // Proverava da li `state.RJ` odgovara `authState.userRJ`
                                        )}
                                        headers={headersComment}
                                        filename={"komentari.csv"}
                                        target="_blank"
                                    >
                                        Preuzmi komentare
                                    </CSVLink>
                                    {/* napravi eksport cele baze sa datumima i vremenima update stanja */}
                                </button>
                                {/* dugme za čuvanje unesenih vrednosti u kolonu Novo stanje */}
                                <button className='save' onClick={handleSave}>Sačuvaj</button> <br />
                                <button className='info' onClick={() => { alert(readInformation) }}>Info</button> <br />
                            </div>
                        </div>


                        <table>
                            <thead>
                                {/* Kolone tabele */}
                                <tr>
                                    <th>ID Trase</th>
                                    <th>ID Čitača</th>
                                    <th>Ugovor</th>
                                    <th>Ime</th>
                                    <th>Adresa</th>
                                    <th>Grad</th>
                                    <th>Merilo</th>
                                    <th>Staro stanje</th>
                                    <th>Novo stanje</th>
                                    <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                                        Potrošnja
                                        {sortOrder === 'asc' ? '▲' : '▼'}
                                    </th>
                                    <th>Komentar</th>
                                    <th>Manje stanje</th>
                                    <th>Za eksport</th>
                                </tr>
                            </thead>
                            {/* Redovi tabele */}
                            <tbody>
                                {filteredData
                                    .filter(state => authState.userRole !== 2 || state.RJ === authState.userRJ) // Filtriranje podataka
                                    .map((state, index) => (
                                        <tr key={index} onKeyDown={(e) => handleKeyDown(e, index)}>
                                            <td>{state.trasaId}</td>
                                            <td>{state.readerId}</td>
                                            <td>{state.contructNumber}</td>
                                            <td>{state.name}</td>
                                            <td>{state.address}</td>
                                            <td>{state.RJ}</td>
                                            <td>{state.meterId}</td>
                                            <td>{state.oldMeter}</td>
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
                                            {/* consumption field table */}
                                            <td className={
                                                (state.newMeter - state.oldMeter) > 1500
                                                    ? 'red'
                                                    : (state.newMeter - state.oldMeter) <= 1500 && (state.newMeter - state.oldMeter) >= 0
                                                        ? 'green' : (state.newMeter - state.oldMeter) < 0 ? 'orange' :
                                                            (state.newMeter) ? 'white'
                                                                : 'white'
                                            }>{state.newMeter - state.oldMeter}</td>
                                            <td>
                                                <button className='comment' onClick={() => handleCommentClick(state.id)}>Unesi komentar</button>
                                            </td>
                                            <td>{state.lessState}</td>
                                            <td>{state.newMeterOfficial}</td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    </>
                )}
            </InputMeterStateSt>

        </HelmetProvider>


    )
};


export default InputMeterStateAdmin;
