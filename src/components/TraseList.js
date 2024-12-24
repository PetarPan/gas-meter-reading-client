import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../styledComponents/Table.style';
import { AuthContext } from '../helpers/AuthContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const TraseList = ({apiUrl}) => {
    const [listOfTrase, setListOfTrase] = useState([]);
    const [filteredTrase, setFilteredTrase] = useState([]);
    const [selectedRJ, setSelectedRJ] = useState('');
    const [selectedReaderId, setSelectedReaderId] = useState('');
    const history = useNavigate();
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${apiUrl}/trase`)
            .then(response => {
                // Sortiraj trase uzlazno prema readerId
                const sortedTrase = response.data.sort((a, b) => a.readerId - b.readerId);
                setListOfTrase(sortedTrase);
            })
            .catch(error => {
                console.error("There was an error fetching trase!", error);
            });
    }, []);
    

    // useEffect za filtriranje kada se promene selektovane vrednosti RJ ili ReaderId
    useEffect(() => {
        let filtered = listOfTrase;

        // Filtriranje prema userRole
        if (authState.userRole === "2") {
            filtered = filtered.filter(trasa => trasa.RJ === authState.userRJ);
        }
        setFilteredTrase(filtered);
    }, [listOfTrase, authState]);


    
    const handleRowClick = (trasaId) => {
        history(`/trase/${trasaId}`);  // Navigacija ka stranici sa detaljima o korisniku
    };

    return (
        <Table>
            <HelmetProvider>
                <Helmet>
                    <title>Lista trasa</title>
                </Helmet>
                <h2>Lista trasa</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naziv trase</th>
                            <th>Dopunski naziv</th>
                            <th>ID čitača</th>
                            <th>RJ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrase.length > 0 ? (
                            filteredTrase.map((trasa) => (
                                <tr key={trasa.trasaId} onDoubleClick={() => handleRowClick(trasa.id)}>
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
