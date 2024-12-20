import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormSt from '../styledComponents/FormSt.style';
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function Registration({apiUrl}) {
    const { authState } = useContext(AuthContext);
    const history = useNavigate();

    /* if (authState.userRole !== 1) {
        // Ako korisnik nije Admin, preusmeri na početnu stranicu
        history('/');
    } */
    //postavka inicijalnih vrednosti iz baze
    const initialValues = {
        userId: "",
        userName: "",
        userRealname: "",
        userSurName: "",
        userRole: "",
        userRJ: "",
        userPassword: ""
    };
    //validacija input polja
    const validationSchema = Yup.object().shape({
        userId: Yup.string().min(7, "ID čitača najmanje sedam karaktera").max(7, "ID čitača može da sadrži najviše sedam karaktera").required("Polje ID čitača je obavezno"),
        userName: Yup.string().min(3, "Ime mora da sadrži najmanje tri karaktera").max(15, "Ime može da sadrži najviše petnaest karaktera").required("Polje ime je obavezno"),
        userSurName: Yup.string().min(3, "Prezime mora da sadrži najmanje tri karaktera").max(25, "Prezime može da sadrži najviše dvadeset i pet karaktera").required("Polje Prezime je obavezno"),
        userRole: Yup.number().required("Odabrati ulogu korisnika"),
        userRJ: Yup.string().required("Odabrati radnu jedinicu"),
        userPassword: Yup.string()
            .min(4, "Šifra mora da sadrži najmanje četiri karaktera")
            .max(20, "Šifra može da sadrži najviše do dvadeset karaktera")
            .matches(/[a-z]/, "Šifra mora da sadrži najmanje jedno malo slovo")
            .matches(/[A-Z]/, "Šifra mora da sadrži najmanje jedno veliko slovo")
            .matches(/[0-9]/, "Šifra mora da sadrži najmanje jedan broj")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Lozinka mora da sadrži najmanje jedan specijalni karakter")
            .required("Polje Šifra je obavezno"),
    });
    //funkcija za kreiranje novog čitača
    const register = (data, { resetForm }) => {
        axios.post(`${apiUrl}/auth`/* "https://gas-meter-reading-c5519d2e37b4.herokuapp.com/auth" */, data)
            .then(() => {
                console.log(data);
                resetForm();
                alert("Novi čitač je kreiran");
            })
            .catch(error => {
                console.error('There was an error!', error);
                if (error.response && error.response.data) {
                    alert("Greška: " + error.response.data.error); // Prikazivanje tačne greške
                } else {
                    alert("Došlo je do greške prilikom registracije.");
                }
            });

    };
    return (
        <>
            {authState.userRole === "1" || authState.userRole === "2" ? (

                <HelmetProvider>

                    {/* Helmet - naziv kartice u pregledaču */}
                    <Helmet>
                        <title>Kreiranje čitača</title>
                    </Helmet>
                    <FormSt>
                        <div>
                            <h1>Kreiranje čitača</h1>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={register}
                                validationSchema={validationSchema}
                                validateOnChange={true}>

                                <Form>
                                    <div className='formContainer'>
                                    <label>ID Čitača: </label>
                                        <ErrorMessage name='userId' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userId'
                                            placeholder='(Ex. josh123)'
                                        />
                                        <label>Korisničko ime: </label>
                                        <ErrorMessage name='userName' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userName'
                                            placeholder='(Ex. josh123)'
                                        />
                                        <label>Ime čitača: </label>
                                        <ErrorMessage name='userRealName' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userRealName'
                                            placeholder='(Ex. josh123)'
                                        />
                                        <label>Prezime čitača: </label>
                                        <ErrorMessage name='userSurName' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userSurName'
                                            placeholder='(Ex. josh123)'
                                        />
                                        <Field
                                            className='inputCreatePost'
                                            name='userRJ'
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
                                        <label>Role: </label>
                                        <ErrorMessage name='userRole' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userRole'
                                            as='select'>
                                            <option value='' disabled>
                                                Odaberi ulogu
                                            </option>
                                            {authState.userRole === "2" ? (
                                                // Ako je userRole == 2, prikazuje samo jednu opciju
                                                <option value='3'>Čitač</option>
                                            ) : (
                                                // Ako nije userRole == 2, prikazuje sve radne jedinice
                                                <>
                                                    <option value='1'>Admin</option>
                                                    <option value='2'>Radna jedinica</option>
                                                    <option value='3'>Čitač</option>
                                                </>
                                            )}

                                        </Field>
                                        <label>Lozinka: </label>
                                        <ErrorMessage name='userPassword' component='span' />
                                        <Field
                                            className='inputCreatePost'
                                            name='userPassword'
                                            type='password'
                                            placeholder='(Unesite lozinku)'
                                        />
                                        <button type='submit' >Kreiraj čitača</button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </FormSt>
                </HelmetProvider>
            ) : (
                history("/")
            )}
        </>
    )
}

export default Registration
