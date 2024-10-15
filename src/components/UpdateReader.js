import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Table } from 'react-bootstrap';

function UpdateReader() {
  let { id } = useParams();
  const [userObject, setUserObject] = useState({});

  let history = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/users/byId/${id}`).then((response) => {
      setUserObject(response.data);
    });

  }, [id]);

  /* funkcija za brisanje čitača */
  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3001/users/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history("/");
        console.log(`User ID ${id} deleted`);
      });

  };

  /* Funkcija za update atributa usera */
  const editPost = (option) => {
    let newValue;

    switch (option) {
      case "userName":
        newValue = prompt(`Enter new ${option}: `);
        axios.put(
          `http://localhost:3001/users/userName`,
          {
            newUserName: newValue,
            id: id,
          },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
          setUserObject({ ...userObject, userName: newValue });
        });
        break;
      case "userRealName":
        newValue = prompt(`Enter new ${option}: `);
        axios.put(
          `http://localhost:3001/users/userRealName`,
          {
            newUserRealName: newValue,
            id: id,
          },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
          setUserObject({ ...userObject, userRealName: newValue });
        });
        break;
      case "userSurName":
        newValue = prompt(`Enter new ${option}: `);
        axios.put(
          `http://localhost:3001/users/userSurName`,
          {
            newUserSurName: newValue,
            id: id,
          },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
          setUserObject({ ...userObject, userSurName: newValue });
        });
        break;
      case "userRJ":
        newValue = prompt(`Enter new ${option}: `);
        axios.put(
          `http://localhost:3001/users/userRJ`,
          {
            newUserRJ: newValue,
            id: id,
          },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
          setUserObject({ ...userObject, userRJ: newValue });
        });
      default:
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
              <td style={{ background: 'grey' }}>Korisničko ime čitača: </td>
              <td onClick={() => editPost("userName")}>{userObject.userName}</td>
            </tr>
            <tr >
              <td style={{ background: 'grey' }}>Ime čitača: </td>
              <td onClick={() => editPost("userRealName")}>{userObject.userRealName}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Prezime čitača: </td>
              <td onClick={() => editPost("userSurName")}>{userObject.userSurName}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Uloga: </td>
              <td onClick={() => editPost("userRole")}>{userObject.userRole}</td>
            </tr>
            <tr>
              <td style={{ background: 'grey' }}>Radna jedinica: </td>
              <td onClick={() => editPost("userRJ")}>{userObject.userRJ}</td>
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
