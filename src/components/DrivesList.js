import axios from 'axios';
import React, { useEffect, useState } from 'react'

function DrivesList() {
    const [listOfDrives, setListOfDrives] = useState([]);

    useEffect(() => {
        axios.get(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/drives`).then((response) => {
            setListOfDrives(response.data)
        }).catch((err) => {
            console.error(err)
        })
    },[]);

    return (
        <div>
            <h2>Prikaz unesenih vožnji</h2>

            <table>
                <thead>
                    <th>Redni broj</th>
                    <th>Cena vožnje</th>
                    <th>Napojnica</th>
                    <th>Poziv</th>
                    <th>Vreme vožnje</th>
                </thead>
                <tbody>
                    {listOfDrives.map((drive) => {
                        <tr key={drive.driveId}>
                            <td>{drive.drivePrice}</td>
                            <td>{drive.driveTip}</td>
                            <td>{drive.drivePayment}</td>
                            <td>{drive.driveCall}</td>
                            <td>{drive.driveDateTime}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default DrivesList;
