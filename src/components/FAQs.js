import React, { useState } from 'react';
import FAQ from '../styledComponents/FAQ.style';

// Sample FAQ data
const faqData = [
  {
    question: "Preko kojih uređaja mogu da koristim aplikaciju?",
    answer: "Aplikacija je optimizovana za rad preko računara, tableta i mobilnih telefona. Prikaz mesta isporuke za očitavanje preko računara je u tabeli, dok je isti preko mobilnih telefona i tableta pojedinačan, jedno po jedno mesto isporuke. Ipak, zbog jednostavnosti, savetujemo korišćenje računara ili mobilnih telefona."
  },
  {
    question: "Šta je neophodno za korišćenje aplikacije?",
    answer: "Za korišćenje aplikacije nephodno je sredstvo preko kojeg ćete se logovati u svoj profil i vršiti unos očitanih količina, računar ili mobilni telefon, kao i stabilna internet veza."
  },
  {
    question: "Kako da se krećem po prikazu mesta isporuke?",
    answer: "U tabelarnom prikazu navigacija je omogućena strelicama gore/dole ili klikom na dugme enter, dok je preko mobilnih uređaja omogućena klikom na prikazane dugmiće prethodni/sledeći."
  },
  {
    question: "Kako snimiti unesena stanja?",
    answer: "U tabelarnom prikazom samim prelaskom na sledeće mesto isporuke strelicama gore/dole ili pritiskom tastera enter automatski se snima unesena količina. U mobilnoj verziji čivanje pojedinačnog stanja vrši se klikom na dugme 'Unesi stanje' nakon čega se automatski prelazi na sledeće mesto isporuke."
  },{
    question: "Kako da proverim svoj unos, odnosno očitanu količinu/potrošnju?",
    answer: "Prilikom unosa stanja imate direktan uvid u trenutnu potrošnju mesta ispruke za koje unosite isto. Ukoliko je potrošnja >=0 polje Potrošnja će biti obojeno zelenom bojom. Ukoliko je potrošnja >1.500 polje unutar kolone Potrošnja će biti crveno, što ne znači samo po sebi da je očitavanje i unos pogrešan, već je neophodno da jop jedanput proverite stanje merila pre prelaska na sledeće. Ukoliko je novo stanje manje od starog ili je mesto isporuke neočitano, polje u koloni Potrošnja će biti narandžasto."
  },
  {
    question: "Kako da se prijavim u aplikaciju?",
    answer: "Možete se prijaviti unosom vašeg korisničkog imena i lozinke."
  },
  {
    question: "Kako mogu da promenim lozinku?",
    answer: "Lozinku možete promeniti u podešavanjima profila na linku 'Promena lozinke'."
  },
  {
    question: "Kako da krenem sa očitavanjem trase?",
    answer: "Da biste započeli sa očitavanjem potrošnje prirodnog gasa na željenoj trasi neophodno je da se ulogujete u aplikaciju sa svojim kredencijalima. Nakon logovanja potrebno je da u tabeli koja je prikazana na početnoj stranici odaberete željenu trasu, nakon čega se otvoriti forma za unos stanja na odabranoj trasi. Napominjemo da je izgled forme za unos trase drugačiji preko računara u odnosu na telefone, odnosno da je aplikacija optimizovana za korišćenje preko mobilnih uređaja."
  },
  {
    question: "Šta i kako sve može da se unese od očitanih podataka?",
    answer: "Od očitanih podataka unosite samo novo stanje merila koje ste identifikovali preko polja 'Broj merila' u polje 'Novo stanje'. Od ostalih podataka po potrebi možete da unesete i komentar za posebno mesto isporuke u slučaju nepredviđenih problema kao što su nedozvoljen pristup merilu, prepreke ispred i oko merila, hronično onemogućen pristup i ostalo."
  },
  {
    question: "Šta da radim kada je novoočitano stanje manje u odnosu na staro?",
    answer: "Omogućen je unos novog stanja koje je manje od starog. U tom slučaju je potrebno proveriti da li je novo stanje zaista manje od starog, nakon unosa se otvara prozor preko kojeg je potrebno potvrditi izbor 'Da', ukolilko nije tako odaberite 'Ne' i nastavite unos očitanih količina."
  },{
    question: "Šta radim sa mestima isporuke koje nisam očitao?",
    answer: "Polja za mesta isporuke koja nisu očitana iz bilo kog razloga ostavljate prazna. Nikako ne unosite stara stanja, niti ista napamet."
  },{
    question: "Šta radim na kraju očitavanja?",
    answer: "Nakon završetka unesenih količina, ukoliko ste sigurni da ste završili kompletan unos potrebno je da odete na početnu stranu aplikacije, Prelged trasa, nakon čega je potrebno da verifikujete količine koje ste unelu klikom na dugme 'Verifikuj'. Nakon navedene radnje status očitavanja biće postavljen na 'verifikovan' čime ste kompletirali celokupan proces očitavanja potrošnje prirodnog gasa za dati mesec."
  },{
    question: "Kako da izađem iz aplikacije na ispravan način?",
    answer: "Ispravan način za izlazak iz aplikacije je na klik crvenog dugmeta na vrgu prozora 'Logout'."
  }
];
function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
        <FAQ>
      <div className="faq-container">
        <h2>Često postavljena pitanja (FAQ)</h2>
        <ul>
          {faqData.map((item, index) => (
            <li key={index}>
              <button onClick={() => toggleAnswer(index)} className="question">
                {item.question}
              </button>
              {openIndex === index && <p className="answer">{item.answer}</p>}
            </li>
          ))}
        </ul>
      </div>
      </FAQ>
    );
}

export default FAQs
