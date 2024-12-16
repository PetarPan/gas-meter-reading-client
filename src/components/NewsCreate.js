import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FormSt from '../styledComponents/FormSt.style';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';
import Table from '../styledComponents/Table.style';


function NewsCreate() {

    const [news, setNews] = useState([]);

    const { authState } = useContext(AuthContext);
    const history = useNavigate();

    const initialValues = {
        newsTitle: '',
        newsBody: '',
    };
    const validationSchema = Yup.object().shape({
        newsTitle: Yup.string().required('Required'),
        newsBody: Yup.string().required('Required'),

    });

    const addNews = async (values, { resetForm }) => {
        try {
            const response = await axios.post('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news', values);
            const newNews = response.data; // Pretpostavlja se da ovde dolazi nova vest sa ID-jem
            resetForm();
            setNews((prevNews) => [...prevNews, newNews])
            alert('Vest uspešno dodata.');
        } catch (error) {
            console.error('Error adding news:', error);
        }
    };
    //za pregled vesti-tabelarni
    useEffect(() => {
        axios.get('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/news')
            .then((response) => {
                console.log(response.data)
                setNews(response.data);
            })
            .catch((error) => {
                console.error('Greška prilikom prikaza vesti:', error);
            });
    }, []);

    const handleRowClick = (id) => {
        history(`/news/${id}`);  // Navigacija ka stranici sa detaljima o korisniku
    };


    return (
        <>
            {authState.userRole === "1" ? (

                <HelmetProvider>

                    {/* Helmet - naziv kartice u pregledaču */}
                    <Helmet>
                        <title>Kreiranje vesti</title>
                    </Helmet>

                    <FormSt>
                        <h1 className='title'>Kreiranje vesti</h1>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={addNews}>
                            <Form className='formContainer'>
                                <label>Naslov vesti:</label>
                                <Field type="text" name="newsTitle" className='inputCreatePost' />
                                <ErrorMessage name="newsTitle" component="div" />

                                <label>Tekst vesti:</label>
                                <Field as='textarea' name="newsBody" className=' textarea' />
                                <ErrorMessage name="newsBody" component="div" />
                                <button type="submit">Dodaj vest</button>
                            </Form>
                        </Formik>
                    </FormSt>

                    <div>
                        <Table>
                            <h2>Lista vesti</h2>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Naslov</th>
                                        <th>Tekst vesti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.length > 0 ? (
                                        news.map((news) => (
                                            <tr key={news.id} onClick={() => handleRowClick(news.id)}>
                                                <td>{news.id}</td>
                                                <td>{news.newsTitle}</td>
                                                <td>{news.newsBody}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Nema vesti za prikaz</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Table>
                    </div>
                </HelmetProvider>
            ) : (
                history("/login")
            )}
        </>
    )
}

export default NewsCreate
