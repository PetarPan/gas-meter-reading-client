//update samo informacije o trasi
import React,
 { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Table } from 'react-bootstrap';

const TrasaID = () => {
    let { id } = useParams();
    const [trase, setTrase] = useState({});
    const history = useNavigate();

    useEffect(() => {
        axios.get(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/byId/${id}`).then((response) => {
        setTrase(response.data);
        });

    }, [id]);
    /* funkcija za brisanje trase */
    const deleteTrasa = (id) => {
        axios
            .delete(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                history("/trase");
                console.log(`Trasa ID ${id} deleted`);
            });

    };

    /* Funkcija za update atributa trase */
    const editPost = (option) => {
        let newValue;

        switch (option) {
            case "trasaId":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/trasaId`,
                    {
                        newTrasaId: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setTrase({ ...trase, trasaId: newValue });
                });
                break;
            case "trasaName":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/trasaName`,
                    {
                        newTrasaName: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setTrase({ ...trase, trasaName: newValue });
                });
                break;
                case "readerId":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/readerId`,
                    {
                        newReaderId: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setTrase({ ...trase, readerId: newValue });
                });
                break;
                case "RJ":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/trase/RJ`,
                    {
                        newRJ: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setTrase({ ...trase, RJ: newValue });
                });
                break;
            default:
                return 0;
        }
    };


    return (
        <HelmetProvider>
            <Helmet>
                <title>Izmena parametara trase</title>
            </Helmet>
            <div style={{ width: '100%', height: window.innerHeight, padding: '20px', textAlign: 'center' }}>
            <br></br>
            <h2>IZMENA PARAMETARA TRASE</h2>
            <Table style={{ margin: 'auto', border: '3px solid', padding: '15px', fontSize: '3vw' }}>
            <tbody>
                        <tr>
                            <td style={{ background: 'grey' }}>ID trase: </td>

                            <td onClick={() => editPost("trasaId")}>{trase.trasaId}</td>
                        </tr>
                        <tr>
                            <td style={{ background: 'grey' }}>Ime trase: </td>
                            <td onClick={() => editPost("trasaName")}>{trase.trasaName}</td>
                        </tr>
                        <tr>
                            <td style={{ background: 'grey' }}>ID povezanog čitača</td>
                            <td onClick={() => editPost("readerId")}>{trase.readerId}</td>
                        </tr>
                        <tr>
                            <td style={{ background: 'grey' }}>RJ trase</td>
                            <td onClick={() => editPost("RJ")}>{trase.RJ}</td>
                        </tr>
                       
                    </tbody>
                </Table>
                {/* Dugme za brisanje*/}
                <button style={{ padding: '10px' }}
                    onClick={() => {
                        deleteTrasa(trase.id);
                        alert(`Obrisana trasa ${trase.trasaId} ${trase.trasaName2} ID: ${trase.id}`);
                    }}>
                    Obriši trasu
                </button>
            </div>
        </HelmetProvider>
    );
};

export default TrasaID;
