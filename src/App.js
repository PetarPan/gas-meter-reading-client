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
import AdminStuff from "./components/AdminStuff";
import FAQs from "./components/FAQs";
import Page404 from "./components/Page404";
import FAQCreate from "./components/FAQCreate";
import NewsCreate from "./components/NewsCreate";
import NewsView from "./components/NewsView";
import OneNewsID from "./components/OneNewsID";



//portal distribucije, linkovi ka aplikaciji za konverziju količina u kWh, aplikacija za računanje havarijskih curenja, aplikacija za prijemi obradu reklamacija, aplikacija za očitavanje potrošnje => pSion

function App() {

  const [authState, setAuthState] = useState({
    userid: "",
    username: "",
    id: 0,
    userRealName: "",
    userSurName: "",
    userRole: "",
    userRJ: "",
    userSatus: "",
    status: false
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  //prevencija pristupa
  /*   useEffect(() => {
      // Sprečavanje desnog klika
      const handleContextMenu = (event) => {
          event.preventDefault();
      };
  
      // Onemogućavanje tastaturskih prečica
      const handleKeyDown = (event) => {
          if (event.ctrlKey && (event.key === 'I' || event.key === 'u') || event.key === 'F12') {
              event.preventDefault();
          }
      };
  
      // Proveravanje da li su alati za razvojne programere otvoreni
      const devToolsOpened = () => {
          if (window.outerWidth - window.innerWidth > 100) {
              alert('Alati za razvojne programere su otvoreni!');
          }
      };
  
      // Postavljanje intervala za proveru otvorenih alata
      const interval = setInterval(devToolsOpened, 1000);
  
      // Dodavanje event listener-a
      window.addEventListener('contextmenu', handleContextMenu);
      window.addEventListener('keydown', handleKeyDown);
  
      // Čišćenje na unmount
      return () => {
          clearInterval(interval);
          window.removeEventListener('contextmenu', handleContextMenu);
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, []); */

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.get(`${apiUrl}/auth/auth`/* 'gas-meter-reading-c5519d2e37b4.herokuapp.com/auth/auth' */, {
        headers: {
          accessToken: accessToken,
        },
      }).then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            userId: response.data.userId,
            userName: response.data.userName,
            id: response.data.id,
            userRealName: response.data.userRealName,
            userSurName: response.data.userSurName,
            userRole: response.data.userRole,
            userRJ: response.data.userRJ,
            userStatus: response.data.userStatus,
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
          <Route path="/login" exact element={<Login  apiUrl={apiUrl}/>} />
          {/* registracija usera i trase*/}
          <Route path="/registration" exact element={<Registration apiUrl={apiUrl}/>} />
          <Route path="/registracija-trase" exact element={<TraseRegisterNew apiUrl={apiUrl}/>} />
          {/* spisak usera i home, klikom na usera pojedinacni prikaz i menjanje parametara usera */}
          <Route path="/list-of-users" exact element={<Home apiUrl={apiUrl}/>} />
          <Route path="/user/:id" element={<UpdateReader apiUrl={apiUrl}/>} />
          <Route path="/" exact element={<ProfilePage apiUrl={apiUrl}/>} />
          {/* spisak trasa, na klik pojedinacna trasa i menjanje parametara */}
          <Route path="/trase" exact element={<TraseList apiUrl={apiUrl}/>} />
          <Route path="/trase/:id" element={<TraseID apiUrl={apiUrl}/>} />
          {/* za sada nista */}
          <Route path="/trase/lista-svih-trasa" exact element={<ListaSvihTrasa apiUrl={apiUrl}/>} />
          {/* promena lozinke */}
          <Route path="/changepassword" element={<ChangePassword apiUrl={apiUrl}/>} />
          {/* admin */}
          <Route path="/admin-page" exact element={<AdminPage apiUrl={apiUrl}/>} />
          <Route path="/admin-stuff" exact element={<AdminStuff apiUrl={apiUrl}/>} />
          {/* pregled trasa unique + unos stanja za admina svi */}
          <Route path="/pregled-trasa-citaci" exact element={<TraseForReader apiUrl={apiUrl}/>} />
          <Route path="/unos-stanja/:id" exact element={<InputMeterState apiUrl={apiUrl}/>} />
          <Route path="/unos-stanja" exact element={<InputMeterStateAdmin apiUrl={apiUrl}/>} />
          {/* posebna aplikacija */}
          <Route path="/kalkulator" exact element={<Kalkulator />} />
          <Route path="/havarije" exact element={<Havarije />} />
          {/* faq */}
          <Route path="/faq" exact element={<FAQs apiUrl={apiUrl}/>} />
          <Route path="/faq-create" exact element={<FAQCreate apiUrl={apiUrl}/>} />
          {/* news */}
          <Route path="/news-create" exact element={<NewsCreate apiUrl={apiUrl}/>} />
          <Route path="/news-view" exact element={<NewsView apiUrl={apiUrl}/>} />
          <Route path="/news/:id" element={<OneNewsID apiUrl={apiUrl}/>} />
          {/* 404 page */}
          <Route path="*" exact element={<Page404 />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
