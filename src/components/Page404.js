import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { GiPoisonGas } from "react-icons/gi";
import Page404St, { Icon, Message, BackButton } from '../styledComponents/Page404St.style';
import { Helmet, HelmetProvider } from "react-helmet-async";


function Page404() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Page404St>
        <Icon>
          <GiPoisonGas size={260} />
        </Icon>
        <Icon>
          <FaExclamationTriangle size={60} />
        </Icon>
        <Message>Status 404 - Stranica nije pronađena</Message>
        <p>UUuuuupsss... Izgleda da stranica koju tražite ne postoji.</p>
        <BackButton href="/login">Vrati se na početnu</BackButton>
      </Page404St>
    </HelmetProvider>

  );
}

export default Page404;
