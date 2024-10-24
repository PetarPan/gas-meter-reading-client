import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import Table from '../styledComponents/Table.style';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
    const [listOfUsers, setListOfUsers] = useState([]);
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
                }
                // Ako je userRole 2, filtriramo korisnike prema authState.RJ
                else if (authState.userRole === '2') {
                    const filteredUsers = response.data.filter(user => user.userRJ === authState.userRJ);
                    const usersWithoutFirst = filteredUsers.slice(1);
                    setListOfUsers(usersWithoutFirst);
                }
            });
        }
    }, [authState.userRole, authState.userRJ]);
    
    const uniqueRJValues = listOfUsers && listOfUsers.length > 0 ? [...new Set(listOfUsers.map((user) => user.userRJ))] : [];
    const selectOptions = {};
    uniqueRJValues.forEach((value) => {
        selectOptions[value] = value;
    });

    const uniqueStatusValues = listOfUsers && listOfUsers.length > 0 ? [...new Set(listOfUsers.map((user) => user.userStatus))] : [];
    const selectStatusOptions = {};
    uniqueStatusValues.forEach((value) => {
        selectStatusOptions[value] = value;
    })

    const handleRowClick = (row) => {
        history(`/user/${row.id}`);
    };
//definisanje kolona za tabelu

    const columns = [
        {
            dataField: 'userName',
            text: 'Korisničko ime',
            sort: true,
            filter: textFilter({
                placeholder: 'Petar...',
            }),
        },
        {
            dataField: 'userRealName',
            text: 'Ime',
            sort: true,
            filter: textFilter({
                placeholder: 'Petar...',
            }),
        },
        {
            dataField: 'userSurName',
            text: 'Prezime',
            sort: true,
            filter: textFilter({
                placeholder: 'Perić...',
            }),
        },
        {
            dataField: 'userRJ',
            text: 'Radna jedinica',
            sort: true,
            filter: selectFilter({
                options: selectOptions,
                placeholder: 'Izaberite radnu jedinicu',
            }),
        },
        {
            dataField: 'id',
            text: 'ID',
        },
        {
            dataField: 'userStatus',
            text: 'Status očitavanja',
            filter: selectFilter(
                {
                    options: selectStatusOptions,
                    placeholder: 'Odaberite status',
                }
            )
        },
    ];

    return (
        <>

            <Table>
                <HelmetProvider>
                    <Helmet>
                        <title>Lista čitača</title>
                    </Helmet>
                    <h2>Lista čitača</h2>
                    <BootstrapTable
                        keyField='id'
                        className='table table-striped table-bordered table-hover table-sm table-responsive react-bootstrap-table filter-text'
                        data={listOfUsers}
                        columns={columns}
                        responsive
                        bordered
                        striped
                        hover
                        condensed
                        noDataIndication='Nisu se uspešno učitali podaci'
                        rowEvents={{
                            onClick: (e, row) => {
                                handleRowClick(row);
                            },
                        }}
                        filter={filterFactory()}
                    />
                </HelmetProvider>
            </Table>

        </>
    );
}

export default Home;
