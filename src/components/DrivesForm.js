import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FormSt from '../styledComponents/FormSt.style';
import axios from 'axios';


function DrivesForm() {

  const initialValues = {
    drivePrice: '',
    driveTip: '',
    drivePayment: '',
    driveCall: '',
    driveDateTime: ''
  };

  const addDrive = async (values, { resetForm }) => {
    try {
      // Dodavanje trenutnog datuma i vremena za driveDateTime
      const currentDate = new Date();
      values.driveDateTime = currentDate.toISOString(); // ISO format za datum i vreme

      await axios.post('https://gas-meter-reading-c5519d2e37b4.herokuapp.com/drives', values);
      resetForm();
      alert('Vožnja je uspešno dodata.');
    } catch (error) {
      console.error('Error adding vožnja:', error);
      alert('ID vožnje već postoji. Proverite i unesite ispravan ID nove vožnje.');
    }
  };
  return (
    <HelmetProvider>

      {/* Helmet - naziv kartice u pregledaču */}
      <Helmet>
        <title>Dodavanje nove vožnje</title>
      </Helmet>

      <FormSt>
        <h1 className='title'>Dodavanje nove vožnje</h1>

        <Formik initialValues={initialValues} onSubmit={addDrive}>
          <Form className='formContainer'>
            {/*  <label>Vožnja ID:</label>
            <Field type="text" name="driveId" className='inputCreatePost' />
            <ErrorMessage name="driveId" component="div" /> */}

            <label>Cena vožnje:</label>
            <Field type="number" name="drivePrice" className='inputCreatePost' />
            <ErrorMessage name="drivePrice" component="div" />

            <label>Napojnica:</label>
            <Field type="number" name="driveTip" className='inputCreatePost' />
            <ErrorMessage name="driveTip" component="div" />

            <label>Način plaćanja:</label>
            <Field type="text"
              name="drivePayment"
              className='inputCreatePost'
              as='select'
              placeholder='(način plaćanja...)'>
              <>
                <option value='Gotovina'>Gotovina</option>
                <option value='Kartica'>Kartica</option>
                <option value='Vaučer'>Vaučer</option>
              </>
            </Field>
            <ErrorMessage name="drivePayment" component="div" />
            <label>Poziv:</label>
            <Field type="text"
              name="driveCall"
              className='inputCreatePost'
              as='select'
              placeholder='Poziv...)'>
              <option value='Poziv'>Poziv</option>
              <option value='Kvaka'>Kvaka</option>
              <option value='E-vaučer'>E-vaučer</option>
              <option value='Aplikacija'>Aplikacija</option>
              <option value='Taxi blok'>Taxi blok</option>
            </Field>
            <ErrorMessage name="driveCall" component="div" />
            <label>Datum i vreme: </label>
            <ErrorMessage name='driveDateTime' component='span' />
            <Field
              className='inputCreatePost'
              name='driveDateTime'
              disabled 
              value={new Date().toLocaleString()} // Prikaz trenutnog datuma
            />
            <button type="submit">Dodaj vožnju</button>
          </Form>
        </Formik>
      </FormSt>
    </HelmetProvider>
  )
}

export default DrivesForm;
