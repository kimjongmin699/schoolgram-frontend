import styled from 'styled-components'

const Button = styled.input`
  border: none;
  border-radius: 5px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.accent};
  opacity: 0.5;
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 100%;
  :hover {
    opacity: 1;
  }
`

export default Button
