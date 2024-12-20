import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Table } from 'react-bootstrap';

function UpdateReader({apiUrl}) {
  let { id } = useParams();
  const [userObject, setUserObject] = useState({});

  let history = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}/users/byId/${id}`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/byId/${id}` */).then((response) => {
      setUserObject(response.data);
    });

  }, [id]);

  /* funkcija za brisanje čitača */
  const deleteUser = (id) => {
    axios
      .delete(`${apiUrl}/users/${id}`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/${id}` */, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history("/");
        console.log(`User ID ${id} deleted`);
      });

  };

  /* Funkcija za update atributa usera */
  const editPost = async (option) => {
    let newValue;
  
    try {
      switch (option) {
        case "userId":
          newValue = prompt(`Enter new ${option}: `);
  
          // Sačekajte da server završi pre nego što ažurirate stanje
          await axios.put(
            `${apiUrl}/users/userId`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/userId` */,
            {
              newUserId: newValue,
              id: id,
            },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          
          // Ako je uspešno ažurirano, ažurirajte korisnički objekat
          setUserObject({ ...userObject, userId: newValue });
          break;
          
        case "userName":
          newValue = prompt(`Enter new ${option}: `);
  
          // Sačekajte da server završi pre nego što ažurirate stanje
          await axios.put(
            `${apiUrl}/users/userName`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/userName` */,
            {
              newUserName: newValue,
              id: id,
            },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          
          // Ako je uspešno ažurirano, ažurirajte korisnički objekat
          setUserObject({ ...userObject, userName: newValue });
          break;
  
        case "userRealName":
          newValue = prompt(`Enter new ${option}: `);
          await axios.put(
            `${apiUrl}/users/userRealName`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/userRealName` */,
            { newUserRealName: newValue, id: id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          setUserObject({ ...userObject, userRealName: newValue });
          break;
  
        case "userSurName":
          newValue = prompt(`Enter new ${option}: `);
          await axios.put(
            `${apiUrl}/users/userSurName`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/userSurName` */,
            { newUserSurName: newValue, id: id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          setUserObject({ ...userObject, userSurName: newValue });
          break;
  
        case "userRJ":
          newValue = prompt(`Enter new ${option}: `);
          await axios.put(
            `${apiUrl}/users/userRJ`/* `https://gas-meter-reading-c5519d2e37b4.herokuapp.com/users/userRJ` */,
            { newUserRJ: newValue, id: id },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          setUserObject({ ...userObject, userRJ: newValue });
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error("Error updating:", error);
      // Ako dođe do greške, prikažite odgovarajuću poruku
      alert(error.response?.data?.error || "Došlo je do greške prilikom ažuriranja.");
      return 0;
    }
  };
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>Izmena parametara čitača</title>
      </Helmet>


      <div style={{ width: '100%', height: window.innerHeight, padding: '20px', textAlign: 'center' }}>
        <h2>IZMENA PARAMETARA ČITAČA</h2>
        <Table style={{ margin: 'auto', border: '3px solid', padding: '15px', fontSize: '3vw' }}>
          <tbody>
          <tr >
              <td style={{ background: 'grey' }}>ID čitača: </td>
              <td onDoubleClick={() => editPost("userId")}>{userObject.userId}</td>
            </tr>
            <tr >
              <td style={{ background: 'grey' }}>Korisničko ime čitača: </td>
              <td onDoubleClick={() => editPost("userName")}>{userObject.userName}</td>
            </tr>
            <tr >
              <td style={{ background: 'grey' }}>Ime čitača: </td>
              <td onDoubleClick={() => editPost("userRealName")}>{userObject.userRealName}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Prezime čitača: </td>
              <td onDoubleClick={() => editPost("userSurName")}>{userObject.userSurName}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Uloga: </td>
              <td onDoubleClick={() => editPost("userRole")}>{userObject.userRole}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Radna jedinica: </td>
              <td onDoubleClick={() => editPost("userRJ")}>{userObject.userRJ}</td>
            </tr>

          </tbody>
        </Table>
        {/* Dugme za brisanje čitača, sa prikazom imena, prezimena  ID citaca */}
        <button style={{ padding: '10px' }}
          onClick={() => {
            deleteUser(userObject.id);
            alert(`Obrisan čitač ${userObject.userName} ${userObject.userSurName} ID: ${userObject.id}`);
          }}>
          Obriši čitača
        </button>
      </div>

    </HelmetProvider>
  );
}
export default UpdateReader;
