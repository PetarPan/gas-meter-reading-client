import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../styledComponents/Table.style';
import { AuthContext } from '../helpers/AuthContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const TraseList = () => {
    const [listOfTrase, setListOfTrase] = useState([]);
    const [filteredTrase, setFilteredTrase] = useState([]);
    const [selectedRJ, setSelectedRJ] = useState('');
    const [selectedReaderId, setSelectedReaderId] = useState('');
    const history = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase')
            .then(response => {
                setListOfTrase(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);
    

    // Filtriranje trasa prema userRole
    const filteredTraseByRole = listOfTrase.filter(trasa => {
        if (authState.userRole === "1") {
            return true; // Prikazi sve trase za admina
        } else if (authState.userRole === "2") {
            return trasa.RJ === authState.userRJ; // Prikazi samo trase koje odgovaraju RJ za čitače
        }
        return false; // Ako nije ni 1 ni 2, ne prikazi nista
    });

    // useEffect za filtriranje kada se promene selektovane vrednosti RJ ili ReaderId
    useEffect(() => {
        let filtered = listOfTrase;

        if (selectedRJ) {
            filtered = filtered.filter(trasa => trasa.RJ === selectedRJ);
        }

        if (selectedReaderId) {
            filtered = filtered.filter(trasa => trasa.readerId === selectedReaderId);
        }

        setFilteredTrase(filtered);
    }, [selectedRJ, selectedReaderId, listOfTrase]);

    // Generisanje unikatnih opcija za pretragu RJ i ReaderId
    const uniqueRJValues = [...new Set(listOfTrase.map(trasa => trasa.RJ))];
    const uniqueReaderId = [...new Set(listOfTrase.map(trasa => trasa.readerId))];
    

    return (
        <Table>
            <HelmetProvider>
                <Helmet>
                    <title>Lista trasa</title>
                </Helmet>
                <h2>Lista trasa</h2>
                
                <label>Pretraga po RJ:</label>
                <select value={selectedRJ} onChange={(e) => setSelectedRJ(e.target.value)}>
                    <option value="">Sve RJ</option>
                    {uniqueRJValues.map((RJ, index) => (
                        <option key={index} value={RJ}>{RJ}</option>
                    ))}
                </select>

                <label>Pretraga po ID čitača:</label>
                <select value={selectedReaderId} onChange={(e) => setSelectedReaderId(e.target.value)}>
                    <option value="">Svi čitači</option>
                    {uniqueReaderId.map((readerId, index) => (
                        <option key={index} value={readerId}>{readerId}</option>
                    ))}
                </select>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naziv trase</th>
                            <th>Naziv 2</th>
                            <th>ID čitača</th>
                            <th>RJ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrase.length > 0 ? (
                            filteredTrase.map((trasa) => (
                                <tr key={trasa.trasaId}>
                                    <td>{trasa.trasaId}</td>
                                    <td>{trasa.trasaName}</td>
                                    <td>{trasa.trasaName2}</td>
                                    <td>{trasa.readerId}</td>
                                    <td>{trasa.RJ}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Nema trasa za prikaz</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </HelmetProvider>
        </Table>
    );
};

export default TraseList;
