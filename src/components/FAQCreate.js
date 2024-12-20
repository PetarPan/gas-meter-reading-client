import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import FormSt from '../styledComponents/FormSt.style';
import { Form, ErrorMessage, Field, Formik } from 'formik';
import { Table } from 'react-bootstrap';
import { AuthContext } from '../helpers/AuthContext';
import * as Yup from 'yup';


function FAQCreate({apiUrl}) {
  
    const [faqs, setFaqs] = useState([]);

    const { authState } = useContext(AuthContext);
    const history = useNavigate();

    const initialValues = {
        faqQuestion: '',
        faqReply: '',
    };
    const validationSchema = Yup.object().shape({
        faqQuestion: Yup.string().required('Ovo polje je obavezno'),
        faqReply: Yup.string().required('Ovo polje je obavezno'),

    });
    useEffect(() => {
      if (authState.userRole !== "1") {
          history("/login");
      }
  }, [authState, history]);
  

    const addfaq = async (values, { resetForm }) => {
        try {
            const response = await axios.post(`${apiUrl}/faqs`/* 'https://gas-meter-reading-c5519d2e37b4.herokuapp.com/faqs' */, values);
            const newFaq = response.data; // Pretpostavlja se da ovde dolazi nova vest sa ID-jem
            resetForm();
            setFaqs((prevFaqs) => [...prevFaqs, newFaq])
            alert('FAQ uspešno dodata.');
        } catch (error) {
            console.error('Error adding faqs:', error);
        }
    };
    //za pregled vesti-tabelarni
    useEffect(() => {
        axios.get(`${apiUrl}/faqs`/* 'https://gas-meter-reading-c5519d2e37b4.herokuapp.com/faqs' */)
            .then((response) => {
                console.log(response.data)
                setFaqs(response.data);
            })
            .catch((error) => {
                console.error('Greška prilikom prikaza faqs:', error);
            });
    }, []);

    const handleRowClick = (id) => {
        history(`/faqs/${id}`);  // Navigacija ka stranici sa detaljima o korisniku
    };


    return (
        <>
                <HelmetProvider>

                    {/* Helmet - naziv kartice u pregledaču */}
                    <Helmet>
                        <title>Kreiranje pitanja i odgovora</title>
                    </Helmet>

                    <FormSt>
                        <h1 className='title'>Kreiranje pitanja</h1>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={addfaq}>
                            <Form className='formContainer'>
                                <label>Naslov pitanja:</label>
                                <Field type="text" name="faqQuestion" className='inputCreatePost' />
                                <ErrorMessage name="faqQuestion" component="div" />

                                <label>Odgovor na pitanje:</label>
                                <Field as='textarea' name="faqReply" className=' textarea' />
                                <ErrorMessage name="faqReply" component="div" />
                                <button type="submit">Dodaj FAQ</button>
                            </Form>
                        </Formik>
                    </FormSt>
                </HelmetProvider>
        </>
  )
}

export default FAQCreate
