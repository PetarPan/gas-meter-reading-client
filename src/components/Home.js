import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Table from '../styledComponents/Table.style';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
    const [listOfUsers, setListOfUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRJ, setSelectedRJ] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const history = useNavigate();
    const { authState } = useContext(AuthContext);


    useEffect(() => {
        if (authState.userRole !== '1' && authState.userRole !== '2') {
            alert('Niste ovlašćeni da vidite ovu stranicu, bićete preusmereni na login stranu');
            history("/login");
        } else {
            axios.get('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users').then((response) => {
                // Ako je userRole 1, prikazujemo sve korisnike
                if (authState.userRole === '1') {
                    const usersWithoutFirst = response.data.slice(1);
                    setListOfUsers(usersWithoutFirst);
                    setFilteredUsers(usersWithoutFirst);  // Inicijalno svi korisnici su prikazani
                }
                // Ako je userRole 2, filtriramo korisnike prema authState.RJ
                else if (authState.userRole === '2') {
                    const filteredUsers = response.data.filter(user => user.userRJ === authState.userRJ);
                    const usersWithoutFirst = filteredUsers.slice(1);
                    setListOfUsers(usersWithoutFirst);
                    setFilteredUsers(usersWithoutFirst);  // Inicijalno prikazujemo sve odgovarajuće korisnike
                }
            });
        }
    }, [authState.userRole, authState.userRJ]);

    // useEffect za filtriranje kada se promene selektovane vrednosti RJ ili Status
    useEffect(() => {
        let filtered = listOfUsers;

        if (selectedRJ) {
            filtered = filtered.filter(user => user.userRJ === selectedRJ);
        }

        if (selectedStatus) {
            filtered = filtered.filter(user => user.userStatus === selectedStatus);
        }

        setFilteredUsers(filtered);
    }, [selectedRJ, selectedStatus, listOfUsers]);

    // Generisanje unikatnih opcija za pretragu RJ i Status
    const uniqueRJValues = [...new Set(listOfUsers.map(user => user.userRJ))];
    const uniqueStatusValues = [...new Set(listOfUsers.map(user => user.userStatus))];
    
    const handleRowClick = (userId) => {
        history(`/user/${userId}`);  // Navigacija ka stranici sa detaljima o korisniku
    };

    return (
        <>
            <Table>
                <HelmetProvider>
                    <Helmet>
                        <title>Lista čitača</title>
                    </Helmet>
                    <h2>Lista čitača</h2>
                    <div>
                        <div>
                            <label>Pretraga po RJ:</label>
                            <select value={selectedRJ} onChange={(e) => setSelectedRJ(e.target.value)}>
                                <option value="">Sve RJ</option>
                                {uniqueRJValues.map((RJ, index) => (
                                    <option key={index} value={RJ}>{RJ}</option>
                                ))}
                            </select>

                            <label>Pretraga po Statusu:</label>
                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="">Svi Statusi</option>
                                {uniqueStatusValues.map((userStatus, index) => (
                                    <option key={index} value={userStatus}>{userStatus}</option>
                                ))}
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID čitača</th>
                                    <th>Korisničko ime</th>
                                    <th>Ime</th>
                                    <th>Prezime</th>
                                    <th>RJ</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} onDoubleClick={() => handleRowClick(user.id)}>
                                            <td>{user.userId}</td>
                                            <td>{user.userName}</td>
                                            <td>{user.userRealName}</td>
                                            <td>{user.userSurName}</td>
                                            <td>{user.userRJ}</td>
                                            <td>{user.userStatus}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nema korisnika za prikaz</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </HelmetProvider>
            </Table>
        </>
    );
}

export default Home;
