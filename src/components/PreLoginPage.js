import React from 'react'
import { Helmet, HelmetProvider } from "react-helmet-async";
import NewsSt from '../styledComponents/NewsSt.style'

function PreLoginPage() {
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Početna strana GMR</title>
                </Helmet>
                <NewsSt>
                    <div className='news'>
                        <h1>Novosti:</h1>
                    </div>
                    <div>
                        <div className='news-container'>
                            <p className='news-title'>Nova funkcionalnost na aplikaciji - Pregled neočitanih u mobilnoj verziji</p>
                            <p className='news-body'>Od decembarskog obračuna 2024. godine omogućen je pregled neočitanih MI unutar komponente na mobilnoj verziji. Komponentu je moguće aktivirati klikom na dugme "Neočitani" u gornjem delu prikaza, kada uđete u željenu trasu za očitavanje. Otvroriće se novi prozor u kojem će biti prikazana MI koja su do tog trenutka neočitana sa informacijama kao što su ime i prezime, adresa i broj merila. Klikom na određeno MI bićete automatski preusmereni na isto i možete da upišete stanje merila za izabrano MI. Jednom kada unesete stanje za određeno MI, ono se više neće nalaziti u prikazu neočitanih jer će automatski biti promenjen status na "Očitano: Da". Za više informacija pročitajte dokumentaciju.
                            </p>
                            <p className='news-body'>Datum objave vesti: 2024-12-20</p>
                        </div>
                    </div>
                    <div>
                        <div className='news-container'>
                            <p className='news-title'>Decembarski obračun</p>
                            <p className='news-body'>Početak očitavanja potrošnje prirodnog gasa za mesec decembar je zakazan za petak, 27. 12. 2024. godine od 8.00, dok je isto dozvoljeno do 31. 12. 2024. Krajnji rok za unos količina, odnosno verifikaciju količina je 31. 12. 2024. do 12.00 bez izuzetaka! Kao i uvek, neophodno je očitavanje što više MI, dok je za neočitana obavezno ostavljanje popunjenih obaveštenja. (datum i vreme ostavljanja)
                            </p>
                            <p className='news-body'>Datum objave vesti: 2024-12-15</p>
                        </div>
                    </div>
                </NewsSt>
            </HelmetProvider>
        </>
    )
}

export default PreLoginPage
