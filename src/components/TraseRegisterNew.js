import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FormSt from '../styledComponents/FormSt.style';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

const TraseRegisterNew = () => {
    const { authState } = useContext(AuthContext);
    const history = useNavigate();

    const initialValues = {
        trasaId: '',
        trasaName: '',
        trasaName2: '',
        readerId: '',
        RJ: ''
    };

    const validationSchema = Yup.object().shape({
        trasaId: Yup.string().required('Required'),
        trasaName: Yup.string().required('Required'),
        trasaName2: Yup.string().required('Required'),
        readerId: Yup.string().required('Required'),
        RJ: Yup.string()
    });

    const dodajTrasu = async (values, { resetForm }) => {
        try {
            await axios.post('http://localhost:3001/trase', values);
            resetForm();
            alert('Trasa je uspešno registrovana.');
        } catch (error) {
            console.error('Error adding trasa:', error);
            alert('ID trase već postoji. Proverite i unesite ispravan ID nove trase.');
        }
    };

    return (

        <>
            {authState.userRole === "1" || authState.userRole === "2" ? (

                <HelmetProvider>

                    {/* Helmet - naziv kartice u pregledaču */}
                    <Helmet>
                        <title>Kreiranje trase</title>
                    </Helmet>
                    
                    <FormSt>
                    <h1 className='title'>Kreiranje trase</h1>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={dodajTrasu}>
                            <Form className='formContainer'>
                                <label>Trasa ID:</label>
                                <Field type="text" name="trasaId" className='inputCreatePost' />
                                <ErrorMessage name="trasaId" component="div" />

                                <label>Trasa Name:</label>
                                <Field type="text" name="trasaName" className='inputCreatePost' />
                                <ErrorMessage name="trasaName" component="div" />

                                <label>Trasa Name 2:</label>
                                <Field type="text" name="trasaName2" className='inputCreatePost' />
                                <ErrorMessage name="trasaName2" component="div" />

                                <label>Reader ID:</label>
                                <Field type="number" name="readerId" className='inputCreatePost' />
                                <ErrorMessage name="readerId" component="div" />

                                <label>Radna jedinica: </label>
                                <ErrorMessage name='RJ' component='span' />
                                <Field
                                    className='inputCreatePost'
                                    name='RJ'
                                    as='select'
                                    placeholder='(radna jedinica)'
                                >
                                    <option value='' disabled>
                                        {authState.userRole === "2" ? 'Tvoja radna jedinica' : 'Odaberi radnu jedinicu'}
                                    </option>

                                    {authState.userRole === "2" ? (
                                        // Ako je userRole == 2, prikazuje samo jednu opciju
                                        <option value={authState.userRJ}>{authState.userRJ}</option>
                                    ) : (
                                        // Ako nije userRole == 2, prikazuje sve radne jedinice
                                        <>
                                            <option value='Beograd'>Beograd</option>
                                            <option value='Jagodina'>Jagodina</option>
                                            <option value='Čačak'>Čačak</option>
                                            <option value='Kragujevac'>Kragujevac</option>
                                            <option value='Novi Sad'>Novi Sad</option>
                                            <option value='Pančevo'>Pančevo</option>
                                            <option value='Kikinda'>Kikinda</option>
                                            <option value='Zrenjanin'>Zrenjanin</option>
                                        </>
                                    )}
                                </Field>

                                <button type="submit">Add Trasa</button>
                            </Form>
                        </Formik>
                    </FormSt>
                </HelmetProvider>
            ) : (
                history("/login")
            )}
        </>
    )
};

export default TraseRegisterNew;
