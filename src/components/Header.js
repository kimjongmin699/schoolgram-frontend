import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { isLoggedInVar } from '../apollo'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faCompass, faUser } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import routes from '../routes'
import { LOCALSTORAGE_TOKEN } from '../constant'
import { useReactiveVar } from '@apollo/client'
import useUser from '../hooks/useUser'
import Avatar from './Avatar'

const logOut = () => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN)
  isLoggedInVar(false)
}

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Column = styled.div``
const Icon = styled.span`
  margin-left: 15px;
`

const Btn = styled.span`
  background-color: ${(props) => props.theme.accent};
  color: black;
  border-radius: 4px;
  padding: 5px 15px;
  font-weight: 600;
`
const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: white;
  font-weight: 600;
`
const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`

function Header() {
  const { data } = useUser()

  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return (
    <SHeader>
      <Wrapper>
        <Column>
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Icon>
                <Link to={routes.home}>
                  <FontAwesomeIcon icon={faHome} size="lg" />
                </Link>
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faCompass} size="lg" />
              </Icon>
              <Icon>
                <Link to={`/users/${data?.me?.username}`}>
                  <Avatar url={data?.me?.avatar} />
                </Link>
              </Icon>
              <Icon onClick={logOut}>
                <FontAwesomeIcon size="lg" icon={faUser} />
              </Icon>
            </IconsContainer>
          ) : (
            <Link to={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
      </Wrapper>
    </SHeader>
  )
}

export default Header
