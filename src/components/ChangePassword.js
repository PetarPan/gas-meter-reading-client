import axios from "axios";
import React, { useContext } from "react";
import FormSt from "../styledComponents/FormSt.style";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ChangePassword(/* {apiUrl} */) {
  const { authState } = useContext(AuthContext);
  const history = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;


  const initialValues = {
    oldPassword: "",
    newPassword: ""
  };
    // Yup sema za validaciju lozinke
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Polje za staru lozinku je obavezno"),
  newPassword: Yup.string()
    .min(6, "Lozinka mora imati najmanje 6 karaktera")
    .matches(/[a-z]/, "Lozinka mora da sadrži najmanje jedno malo slovo")
    .matches(/[A-Z]/, "Lozinka mora da sadrži najmanje jedno veliko slovo")
    .matches(/[0-9]/, "Lozinka mora da sadrži najmanje jedan broj")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Lozinka mora da sadrži najmanje jedan specijalni karakter")
    .required("Polje za novu lozinku je obavezno")
});

  const changePassword = (values) => {   
    axios
      .put(
        `${apiUrl}/auth/changepassword`/* "https://gas-meter-reading-c5519d2e37b4.herokuapp.com/auth/changepassword" */,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
          withCredentials: true, // Omogućava slanje kolačića sa zahtevom
        }
      )
      .then((response) => {
        alert("Uspešno promenjena lozinka");
        history('/');
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        }
      });
  };
  return (
    <>
    {authState.userRole === "1" || authState.userRole === "2" || authState.userRole === "3" ? (
      <HelmetProvider>
        <Helmet>
          <title>Promena lozinke</title>
        </Helmet>
        <FormSt>
          <h3>Forma za izmenu lozinke:</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={changePassword}
          >
            <Form>
              <div className="formContainer">
                <div>
                  <label>Stara Lozinka:</label>
                  <Field
                    type="password"
                    name="oldPassword"
                    placeholder="Unesite staru lozinku"
                    className="inputCreatePost"
                  />
                  <ErrorMessage name="oldPassword" component="span" />
                </div>
                <br />
                <div>
                  <label>Nova Lozinka:</label>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Unesite novu lozinku"
                    className="inputCreatePost"
                  />
                  <ErrorMessage name="newPassword" component="span" />
                </div>
                <br />
                <button type="submit">Sačuvaj Promene</button>
              </div>
            </Form>
          </Formik>
        </FormSt>
      </HelmetProvider>
    ) : (
      history("/login")
    )}
  </>
  )};

export default ChangePassword;
