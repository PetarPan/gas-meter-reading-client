import styled from 'styled-components';

const FormSt = styled.div`

 
.formContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
    height: auto;
    padding: 20px;
    border: 5px solid dodgerblue;
    border-radius: 5px;
    position: relative;
    top: 20px;
    margin: auto
  }

.container {
  margin: auto;
  width: 50%;
  text-aligh: center;
}

  .formContainer .inputCreatePost {
    height: 50px;
    width: 250px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 2px solid grey;
    border-radius: 5px;
    padding-left: 10px;
    font-size: 15px;
  }
  
  .formContainer button {
    display: block;
    margin: 0 auto;
    margin-top: 15px;
    height: 40px;
    width: 100px;
    border: none;
    background-color: lightskyblue;
    border-radius: 5px;
    color: white;
  }
  
  .formContainer button:hover {
    cursor: pointer;
    background-color: dodgerblue;
  }
  
  span {
    color: black;
    background: red;
  }
  .title {
    font-size: 3em;
    text-align: center;
    padding: 15px
  }

  .label {
    font-size: 1.5em;
}

/* Media Query for Mobile Devices */
@media (max-width: 600px) {
    .formContainer {
        width: 90%; /* Širina formContainer se smanjuje */
        padding: 10px; /* Smanjenje padding-a */
    }

    .container {
        width: 100%; /* Širina kontejnera se prilagođava */
    }

    .formContainer .inputCreatePost {
        height: 40px; /* Smanjenje visine polja */
        width: 90%; /* Širina polja se prilagođava */
        font-size: 14px; /* Smanjenje veličine fonta */
    }

    .formContainer button {
        height: 35px; /* Smanjenje visine dugmeta */
        width: 80px; /* Smanjenje širine dugmeta */
        font-size: 14px; /* Smanjenje veličine fonta */
    }

    .title {
        font-size: 2em; /* Smanjenje veličine naslova */
    }

    .label {
        font-size: 1.2em; /* Smanjenje veličine fonta za oznake */
    }
}

`

export default FormSt;