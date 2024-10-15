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
    font-size: 2.5em;
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

`;

export default InputMeterStateSt;
