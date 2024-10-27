import styled from "styled-components";

const HomeTable = styled.div`

table {
  margin-left: 15px;
  margin-top: 50px;
}
  th {
    text-align: center;
    vertical-align: middle;
    background-color: #74c0fc; /* svetlo plava pozadina za zaglavlje */
    color: white; /* bela boja teksta za zaglavlje */
    font-size: 1.2em; /* veći font za zaglavlje */
  }

  td {
    text-align: center;
    vertical-align: middle;
    padding: 0 15px 0 15px;
  }

  tr:nth-child(odd) {
    background-color: white; /* bela pozadina za neparne redove */
  }

  tr:nth-child(even) {
    background-color: #e6e6e6; /* svetlo siva pozadina za parne redove */
  }

  input {
    margin: 0 auto;
  }

  select {
    margin: 0 auto;
  }

  /* Sledece tri klase sakrivaju "Filter By u zaglavlju tabele, mnogo dobra fora, svaka cast onome ko je provali" */
  .react-bootstrap-table .filter-text {
    display: none;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

export default HomeTable;
