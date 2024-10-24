//prikaz svih trasa, klikom na jednu ide se na izmenu podataka, veze citaca i trasa
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../styledComponents/Table.style';
import { AuthContext } from '../helpers/AuthContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';

const TraseList = () => {
    const [listOfTrase, setListOfTrase] = useState([]);
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
   const filteredTrase = listOfTrase.filter(trasa => {
    if (authState.userRole === "1") {
        return true; // Prikazi sve trase
    } else if (authState.userRole === "2") {
        return trasa.RJ === authState.userRJ; // Prikazi samo trase koje odgovaraju userRJ
    }
    return false; // Ako nije ni 1 ni 2, ne prikazi nista
});

    const handleRowClick = (row) => {
        history(`/trase/${row.id}`);
    };

    const uniqueRJValues = listOfTrase && listOfTrase.length > 0 ? [...new Set(listOfTrase.map((user) => user.RJ))] : [];
    const selectRJOptions = {};
    uniqueRJValues.forEach((value) => {
        selectRJOptions[value] = value;
    });

    const uniqueIDValues = listOfTrase && listOfTrase.length > 0 ? [...new Set(listOfTrase.map((user) => user.readerId))] : [];
    const selectIDOptions = {};
    uniqueIDValues.forEach((value) => {
        selectIDOptions[value] = value;
    });

    const columns = [
        {
            dataField: 'trasaId',
            text: 'ID Trase',
            sort: true,
            filter: textFilter({
                placeholder: '124...',
            }),
        },
        {
            dataField: 'trasaName',
            text: 'Naziv trase',
            sort: true,
            filter: textFilter({
                placeholder: 'Batajnica...',
            }),

        },
        {
            dataField: 'readerId',
            text: 'ID čitača',
            sort: true,
            filter: selectFilter({
                options: selectIDOptions,
                placeholder: 'Izaberite čitača'})

        },
        {
            dataField: 'RJ',
            text: 'RJ',
            sort: true,
            filter: selectFilter({
                options: selectRJOptions,
                placeholder: 'Izaberite radnu jedinicu'})

        },
        {
            dataField: 'id',
            text: 'ID',
        },
    ];

    return (
        <div>
            <Table>
                <h1>Lista Trasa</h1>
                <HelmetProvider>
                    <Helmet>
                        <title>Lista trasa</title>
                    </Helmet>
                    <h2>Lista trasa</h2>
                    <BootstrapTable
                        keyField='id'
                        className='table table-striped table-bordered table-hover table-sm table-responsive react-bootstrap-table filter-text'
                        data={filteredTrase}
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

            {/*  <ul>
                {trase.map(trasa => (
                    <li key={trasa.id}>
                        <Link to={`/trase/${trasa.id}`}>
                            {trasa.trasaName} - {trasa.trasaName2} - {trasa.readerId}
                        </Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default TraseList;
