import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';



function ReadStatus( ) {
  const [status, setStatus] = useState(null);
  const prevStatus = useRef(null); // Koristimo useRef za praćenje prethodne vrednosti
  const history = useNavigate();
  const { authState } = useContext(AuthContext);

  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("news url: " + apiUrl);
  console.log("Environment variables:", process.env);
  console.log("API URL in production:", process.env.REACT_APP_API_URL);

  useEffect(() => {
    axios.get(apiUrl + `/status`)
      .then(response => {
        console.log("Server Response:", response.data); // Proveri šta vraća server
        setStatus(response.data.status); // Postavlja status sa servera
      })
      .catch((error) => {
        console.error('Greška pri učitavanju statusa:', error);
      });
  }, []);


  useEffect(() => {
    // Ovaj useEffect se poziva kad god se status promeni
    if (status !== prevStatus.current) {
      console.log("Status Promenjen:", status); // Prikazuje promenjenu vrednost statusa
      prevStatus.current = status; // Ažurira prethodnu vrednost
    }
  }, [status]); // Ovaj efekat se poziva svaki put kad se status promeni

  // Funkcija za toggle statusa
  const toggleStatus = async () => {
    try {
      const response = await axios.put(apiUrl + `/status/toggleStatus`); // Poziv za promenu statusa
      setStatus(response.data.status); // Ažurira status sa servera
      alert(`Status je postavljen na ${response.data.status === 1 ? 'Aktivan' : 'Neaktivan'}`);
    } catch (error) {
      console.error('Greška pri promeni statusa:', error);
    }
  };

  return (
    <>
      {authState.userRole === "1" ? (
        <div>
          <h3>Status očitavanja: {status !== null ? (Number(status) === 1 ? 'Aktivan' : 'Neaktivan') : 'Učitavanje...'}</h3>
          <button onClick={toggleStatus}>Promeni status očitavanja</button>
        </div>
      ) : (
        history("/login")
      )}
    </>
  );
}

export default ReadStatus;
