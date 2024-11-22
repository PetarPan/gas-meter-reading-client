import styled from 'styled-components';

const InputMeterStateSt = styled.div`
    margin: 50px auto;
    width: 95%;
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
        top: 20px;
        right: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        width: 80px;
        height: 35px;
        border: black 1.5px solid;
        cursor: pointer;
    }
    .info {
        position: absolute;
        top: 20px;
        right: 120px;
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
    top: 55px;           /* Udaljenost od vrha prozora */
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
  .read-information {
    position: relative;
}
.verification-st {
    padding: 10px 0 10px 0;
    font-size: 17px;
    cursor: pointer;
}
.ver-btn {
    background: dodgerblue;
    color: white;
    width: 75px;
    height: 40px;
    border-radius: 10px;
}
.comment {
    cursor: pointer;
}

${'' /* mobilna verzija */}

@media (max-width: 600px) {
    html, body {
    overflow-x: hidden;
}
    .mobile-view {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: -35px; 
        height: 700px; 
        width: 425px;
        box-sizing: border-box;
        overflow: hidden; 
    }

    .user-info-input, .search, .input-style, .buttons {
        margin: 0 auto;
        width: 85%;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        flex: 1;
        font-size: 3.5vw; 
    }

    .title {
        font-size: 19px; 
        text-align: center;
    }

    .user-info div, .input-style div {
        font-size: 3.8vw; 
        margin-bottom: 5px;
    }

    .search label {
        font-size: 3.5vw;
        display: block;
        margin-bottom: 5px;
    }

    input {
        width: 40%;
        padding: 10px;
        margin-bottom: 10px;
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
${'' /*         margin-top: 5px;
 */}    }

    .buttons {
        display: flex;
        justify-content: center;
        padding: 0 5px 0 5px;
        width: 100%;
${'' /*         margin-top: 5px;
 */}    }

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
    .info-btn {
        margin-left: 45%;
        width: 50px;
    }
}

.verification-st {
    font-size: 15px;
}



`;

export default InputMeterStateSt;
