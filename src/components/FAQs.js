import React, { useState, useEffect } from 'react';
import FAQ from '../styledComponents/FAQ.style';
import axios from 'axios';

function FAQs({apiUrl}) {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Pregled FAQ-ova
  useEffect(() => {
    axios
      .get(`${apiUrl}/faqs`)
      .then((response) => {
        console.log(response.data); 
        setFaqs(response.data);
      })
      .catch((error) => {
        console.error('Greška prilikom prikaza faqs:', error);
      });
  }, []);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };

  return (
    <FAQ>
      <div className="faq-container">
        <h2>Često postavljena pitanja (FAQ)</h2>
        <ul>
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <li key={item.id} className="faq-item">
                <button
                  onClick={() => toggleAnswer(index)}
                  className="question"
                >
                  {item.faqQuestion}
                </button>
                {openIndex === index && (
                  <p className="answer">{item.faqReply}</p>
                )}
              </li>
            ))
          ) : (
            <p>Nema dostupnih pitanja i odgovora.</p>
          )}
        </ul>
      </div>
    </FAQ>
  );
}

export default FAQs;
