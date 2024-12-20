import React, { useRef, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormSt from '../styledComponents/FormSt.style';
import axios from 'axios';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from '../helpers/AuthContext';
import { MdGasMeter } from 'react-icons/md';

function Login({apiUrl}) {

    const initialValues = {
        userName: "",
        userPassword: ""
    };

    const inputRef = useRef(null); //kreiranje reference za input polje
    
    useEffect(() => {
        inputRef.current.focus(); ///postavlja fokus na input polje za username
    }, [])
    const validationSchema = Yup.object().shape({
        userName: Yup.string()
            .required('Polje korisniko ime je obavezno'),
        userPassword: Yup.string()
            .required('Polje lozinka ime je obavezno'),
    });
    const { authState, setAuthState } = useContext(AuthContext);
    const history = useNavigate();
    //provera da li je korisnik ulogovan, ukoliko jeste ne moze da ide na /login
    useEffect(() => {
        if (authState.status) {
            history("/");
        }
    }, [authState.status, history]);

    //funkcija za login čitača i preusmeravanje na početnu stranicu u slučaju uspešnog logovanja
    const login = (values) => {
        const data = { userName: values.userName, userPassword: values.userPassword }
        axios.post(`${apiUrl}/auth/login`/* 'https://gas-meter-reading-c5519d2e37b4.herokuapp.com/auth/login' */, data).then((response) => {

            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({ userId: response.data.userId, userName: response.data.userName, id: response.data.id, userSurName: response.data.userSurName, userRealName: response.data.userRealName, userRole: response.data.userRole, userRJ: response.data.userRJ, status: true, userStatus: response.data.userStatus });
                history("/");
                //window.location.reload();
            }
        });
    };

    return (
        <HelmetProvider>
            {/* Helmet - naziv kartice u pregledaču */}
            <Helmet>
                <title>Login</title>
            </Helmet>
            <FormSt>
                <h1 className='title'>Login za čitače</h1>

                {/* ovde dodaj formik, form i field tagove sa pripadajucim atributima */}
                <Formik
                    initialValues={initialValues}
                    onSubmit={login}
                    validationSchema={validationSchema}
                    validateOnChange={true}>
                    <div className='formContainer'>
                        {/* <form onClick={(e) => {
                            e.preventDefault();
                        }}> */}
                        <Form>
                            <div className='container'>
                                <ErrorMessage name='userName' component='span' />
                                <label className='label'>Korisničko ime:</label>
                                <Field
                                    innerRef={inputRef}
                                    className='inputCreatePost'
                                    name='userName'
                                    placeholder='(Ex. josh123)'
                                />
                                <br></br>
                                <ErrorMessage name='userPassword' component='span' />
                                <label className='label'>Lozinka:</label>
                                <Field
                                    className='inputCreatePost'
                                    name='userPassword'
                                    placeholder='(Ex. josh123)'
                                    type="password"
                                />
                                {/* <input type='password'
                                        className='inputCreatePost'
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                        }} /> */}
                            </div>
                            <button type='submit'>Login</button>
                        </Form>

                    </div>
                </Formik>
            <div className='icon'>
            <MdGasMeter/>

            </div>
            </FormSt>
        </HelmetProvider>
    )
}

export default Login
