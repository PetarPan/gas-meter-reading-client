import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';


function OneNewsID() {
    let { id } = useParams();
    const [news, setNews] = useState({});
    const history = useNavigate();
    const { authState } = useContext(AuthContext);
    


    useEffect(() => {
        axios.get(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news/byId/${id}`).then((response) => {
            setNews(response.data);
        });

    }, [id]);

    const deleteNews = (id) => {
        axios
            .delete(`https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                history('/news-create');
            });

    };
    /* const editPost = (option) => {
        let newValue;


        switch (option) {
            case "newsTitle":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news/newsTitle`,
                    {
                        newNewsTitle: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setNews({ ...news, newsTitle: newValue });
                });
                break;
            case "newsBody":
                newValue = prompt(`Enter new ${option}: `);
                axios.put(
                    `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news/newsBody`,
                    {
                        newNewsBody: newValue,
                        id: id,
                    },
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                ).then(() => {
                    setNews({ ...news, newsBody: newValue });
                });
                break;
           
            default:
                return 0;
        }
    }; */

    return (
        <div>
         {authState.userRole === "1" ? (
            <HelmetProvider>
                <Helmet>
                    <title>Izmena parametara vesti</title>
                </Helmet>
                <div style={{ width: '100%', height: window.innerHeight, padding: '20px', textAlign: 'center' }}>
                    <br></br>
                    <h2>IZMENA PARAMETARA VESTI</h2>
                    <Table style={{ margin: 'auto', border: '3px solid', padding: '15px', fontSize: '3vw' }}>
                        <tbody>
                            <tr>
                                <td style={{ background: 'grey' }}>ID trase: </td>
                                <td>{news.id}</td>
                            </tr>
                            <tr>
                                <td style={{ background: 'grey' }}>Naslov trase: </td>
                                <td >{news.newsTitle}</td>
                            </tr>
                            <tr>
                                <td style={{ background: 'grey' }}>Ime trase: </td>
                                <td >{news.newsBody}</td>
                            </tr>


                        </tbody>
                    </Table>
                    {/* Dugme za brisanje*/}
                    <button style={{ padding: '10px' }}
                        onClick={() => {
                            deleteNews(news.id);
                            alert(`Obrisana vest ${news.id} ${news.newsTitle}`);
                        }}>
                        Obriši vest
                    </button>
                </div>
            </HelmetProvider>
        ) : (
                history("/login")
            )}
        </div>
    )
}

export default OneNewsID
