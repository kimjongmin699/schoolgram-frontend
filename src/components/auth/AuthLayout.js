import styled from 'styled-components'

const Containier = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`
function AuthLayout({ children }) {
  return (
    <Containier>
      <Wrapper>{children}</Wrapper>
    </Containier>
  )
}

export default AuthLayout
