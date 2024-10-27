import axios from "axios";
import React, { useContext } from "react";
import FormSt from "../styledComponents/FormSt.style";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ChangePassword() {
  const { authState } = useContext(AuthContext);
  const history = useNavigate();

  const initialValues = {
    oldPassword: "",
    newPassword: ""
  };
    // Yup sema za validaciju lozinke
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Polje za staru lozinku je obavezno"),
  newPassword: Yup.string()
    .min(6, "Lozinka mora imati najmanje 6 karaktera")
    .matches(/[A-Z]/, "Lozinka mora sadržati barem jedno veliko slovo")
    .matches(/\d/, "Lozinka mora sadržati barem jedan broj")
    .required("Polje za novu lozinku je obavezno")
});

  
  const changePassword = (values) => {   
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
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
