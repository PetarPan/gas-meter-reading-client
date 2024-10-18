import styled from 'styled-components';

const InputMeterStateSt = styled.div`
    margin: 50px auto;
    width: 90%;
    position: relative;

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        text-align: center;
        padding: 8px;
        border: 3px solid #ddd; /* Podebljane granice za 3px */
    }

    th {
        background-color: #007bff;
        color: white;
    }

    input {
        width: 100%;
        box-sizing: border-box;
        padding: 4px;
    }

    .save {
        position: absolute;
        top: 10px;
        right: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        width: 80px;
        height: 35px;
        border: black 1.5px solid;
    }
    .button-csv {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        gap: 20px;
            }
    .export-csv {
        padding: 10px 20px;
        background: green;
        color: white;
        border: black 1.5px solid;
        cursor: pointer;
        text-decoration: none;
    }
    .export-csv a {
        text-decoration: none;
        color: white;

    }
    ${'' /* definisemo boje za validaciju unosa kolicina */}

    ${'' /* crveno ukolilko je kolicina > 1500 kubika */}
    .red {
        background: red;
    }
    ${'' /* zeleno ukoliko je kolicina >=0 - <= 1500 */}
    .green {
        background: green;
    }
    ${'' /*  */}
    .white{
        background: white;
    }
    ${'' /* narandzasta ukoliko kolicina nije unesena */}
    .orange {
        background: orange;
    }
    .title {
    font-size: 1.7em;
    text-align: center;
    padding: 15px
  }
  .main-title {
    position: sticky;
    top: 70px;           /* Udaljenost od vrha prozora */
    z-index: 100; 
    background: white;
    padding-bottom: 10px;
  }
  button {
    margin: 0 5px 5px 0
  }
  
  .mobile-view, .user-info, .search, .input-style {
    border: 1px solid black;
    padding: 5px;
    margin-bottom: 5px;
  }
  .buttons {
    display: flex;
    justify-content: center;  
    align-items: center;     
  }

${'' /* mobilna verzija */}

@media (max-width: 600px) {
    html, body {
        height: 100vh; /* Puna visina ekrana */
        padding: 0;
    }

    .mobile-view {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: -35px; 
        height: 750px; 
        box-sizing: border-box;
        overflow: hidden; 
    }

    .user-info, .search, .input-style, .buttons {
        width: 100%;
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        flex: 1;
        font-size: 3.5vw; 
    }

    .title {
        font-size: 17px; 
        text-align: center;
    }

    .user-info div, .input-style div {
        font-size: 3.8vw; 
        margin-bottom: 8px;
    }

    .search label {
        font-size: 3.5vw;
        display: block;
        margin-bottom: 8px;
    }

    input {
        width: 100%;
        padding: 5px;
        font-size: 3vw;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        padding: 5px;
        font-size: 3vw; /* Smanjen font za dugmad */
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 5px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 5px;
    }

    .buttons button {
        width: 48%;
    }

    .consumption {
        font-size: 3vw;
        padding: 5px;
        margin-top: 2px;
    }

    .consumption.green {
        background: green;
        color: black
    }

    .consumption.orange {
        background: orange;
        color: black;
    }

    .consumption.red {
        background: red;
        color: black;
    }

    .newMeter {
        font-size: 3vw;
        margin-bottom: 3px;
    }

    .input-style, .user-info {
        
       
    }
}





`;

export default InputMeterStateSt;
