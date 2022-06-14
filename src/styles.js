import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const lightTheme = {
  fontColor: '#2c2c2c',
  bgColor: 'white',
  accent: '#0095f6',
  borderColor: 'rgb(219,219,219)',
}
export const darkTheme = {
  fontColor: 'white',
  bgColor: '#2c2c2c',
  color: 'rgb(38,38,38)',
  borderColor: 'rgb(219,219,219)',
  accent: '#0095f6',
}

export const FatLink = styled.span`
  font-weight: 600;
  color: rgb(142, 142, 142);
`

export const GlobalStyles = createGlobalStyle`
${reset}
input  {
  all:unset;
}
*{
  box-sizing:border-box ;
}
body{
  background-color: ${(props) => props.theme.bgColor}  
}
a{
  text-decoration: none;
  color:inherit;
}
    
`
