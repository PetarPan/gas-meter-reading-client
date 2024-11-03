import styled from 'styled-components';

const Page404St = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  color: #333;
  text-align: center;
  padding-top: 70px;
  `;

export const BackButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Icon = styled.div`
  color: #ff6347;
  margin-bottom: 20px;
`;

export const Message = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
`;

export default Page404St;
