import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from '../styledComponents/Table.style';


function DrivesList() {
    const [listOfDrives, setListOfDrives] = useState([]);

    useEffect(() => {
        axios.get(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/drives`).then((response) => {
            setListOfDrives(response.data)
        }).catch((err) => {
            console.error(err)
        })
    }, []);

    return (
        <Table>
            <div>
                <h2>Prikaz unesenih vožnji</h2>

        <a href='/drives-form'>Pređi na formu za unos novih vožnji</a>
                <table>
                    <thead>
                        <th>Cena vožnje</th>
                        <th>Napojnica</th>
                        <th>Način plaćanja</th>
                        <th>Poziv</th>
                        <th>Vreme vožnje</th>
                    </thead>
                    <tbody>
                        {listOfDrives.length > 0 ? (
                            listOfDrives.map((drive) => (
                                <tr key={drive.id}>
                                    <td>{drive.drivePrice}</td>
                                    <td>{drive.driveTip}</td>
                                    <td>{drive.drivePayment}</td>
                                    <td>{drive.driveCall}</td>
                                    <td>{drive.driveDateTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Nema vožnji za prikaz</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Table>
    )
}

export default DrivesList;
