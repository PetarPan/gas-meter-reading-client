import styled from 'styled-components';

const Navbar = styled.div`

.navbar {
    width: 100%;
    height: 70px;
    background-color: dodgerblue;
    display: flex;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
  }
  .navbar .links {
    flex: 50%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .navbar a {
    margin-left: 20px;
    text-decoration: none;
    color: white;
  }
  
  .navbar button {
    width: 100px;
    height: 40px;
    cursor: pointer;
    margin-right: 10px;
    background-color: white;
  }
  
  .navbar h1 {
    text-align: right;
    margin-right: 10px;
    color: white;
    font-weight: lighter;
  }
  h4 {
    padding: 10px;
  }
`

export default Navbar;