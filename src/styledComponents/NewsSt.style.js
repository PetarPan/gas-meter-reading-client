import styled from "styled-components";

const NewsSt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #f4f4f9;

  .news-container {
    width: 60%; /* Optimalna širina */
    background: white; /* Bela pozadina */
    border-radius: 10px; /* Zaobljeni uglovi */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Blagi senka efekat */
    padding: 20px; /* Unutrašnji razmak */
    display: flex;
    flex-direction: column;
    gap: 10px; /* Razmak između naslova i teksta */
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    /* Efekat lebdenja mišem */
    &:hover {
      transform: translateY(-5px); /* Lagano podizanje */
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .news-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ececec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      text-transform: capitalize; /* Prvo slovo veliko */
      text-align: center; /* Centriran naslov */
    }

    .news-body {
      font-size: 1rem;
      color: #555;
      line-height: 1.6; /* Poboljšanje čitljivosti */
      text-align: justify; /* Tekst poravnat */
    }
  }
`;

export default NewsSt;
