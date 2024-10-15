import "./App.css";
import {
  BrowserRouter as Router, Route, Routes
} from 'react-router-dom';
import Login from "./components/Login";
import Home from "./components/Home";
import Registration from "./components/Registration";
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from "react";
import axios from "axios";
import Kalkulator from "./components/Kalkulator";
import Havarije from "./components/Havarije";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import TraseList from "./components/TraseList";
import TraseRegisterNew from "./components/TraseRegisterNew";
import TraseID from "./components/TraseID";
import ListaSvihTrasa from "./components/ListaSvihTrasa";
import UpdateReader from "./components/UpdateReader"
import ChangePassword from "./components/ChangePassword";
import TraseForReader from "./components/TraseForReader";
import InputMeterState from "./components/InputMeterState";
import NavBar from "./components/NavBar";
import InputMeterStateAdmin from "./components/InputMeterStateAdmin";
import 'react-confirm-alert/src/react-confirm-alert.css';


//portal distribucije, linkovi ka aplikaciji za konverziju količina u kWh, aplikacija za računanje havarijskih curenja, aplikacija za prijemi obradu reklamacija, aplikacija za očitavanje potrošnje => pSion

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    userRealname: "",
    userSurName: "",
    userRole: "",
    userRJ: "",
    status: false
  });


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.get('http://localhost:3001/auth/auth', {
        headers: {
          accessToken: accessToken,
        },
      }).then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.userName,
            id: response.data.id,
            userRealname: response.data.userRealname,
            userSurName: response.data.userSurName,
            userRole: response.data.userRole,
            userRJ: response.data.userRJ,
            status: true,
          });
        }
      });
    } else {
      setAuthState({ ...authState, status: false });
    }
  }, []);




  return (
    <AuthContext.Provider value={{ authState, setAuthState }} >
      <Router>
        <NavBar />
        <Routes>
          {/* login */}
          <Route path="/login" exact element={<Login />} />
          {/* registracija usera i trase*/}
          <Route path="/registration" exact element={<Registration />} />
          <Route path="/registracija-trase" exact element={<TraseRegisterNew />} />
          {/* spisak usera i home, klikom na usera pojedinacni prikaz i menjanje parametara usera */}
          <Route path="/list-of-users" exact element={<Home />} />
          <Route path="/user/:id" element={<UpdateReader />} />
          <Route path="/" exact element={<ProfilePage />} />
          {/* spisak trasa, na klik pojedinacna trasa i menjanje parametara */}
          <Route path="/trase" exact element={<TraseList />} />
          <Route path="/trase/:id" element={<TraseID />} />
          {/* za sada nista */}
          <Route path="/trase/lista-svih-trasa" exact element={<ListaSvihTrasa />} />
          {/* promena lozinke */}
          <Route path="/changepassword" element={<ChangePassword />} />
          {/* admin */}
          <Route path="/admin-page" exact element={<AdminPage />} />
          {/* pregled trasa unique + unos stanja za admina svi */}
          <Route path="/pregled-trasa-citaci" exact element={<TraseForReader />} />
          <Route path="/unos-stanja/:id" exact element={<InputMeterState />} />
          <Route path="/unos-stanja" exact element={<InputMeterStateAdmin />} />
          {/* posebna aplikacija */}
          <Route path="/kalkulator" exact element={<Kalkulator />} />
          <Route path="/havarije" exact element={<Havarije />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
