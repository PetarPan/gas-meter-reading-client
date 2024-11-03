import styled from "styled-components";

const FAQ = styled.div`

.faq-container {
  max-width: 660px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
   align-items: center;
   text-align: center;
}
h2 {
  margin-bottom: 10px;
}
.question {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 12px;
  font-size: 16px;
  background-color: #f9f9f9;
  border-left: 3px solid #007bff;
}

.answer {
  padding: 12px;
  background-color: #f9f9f9;
  border-left: 3px solid #007bff;
  margin-top: 5px;
  font-size: 16px;
}

`;

export default FAQ;
