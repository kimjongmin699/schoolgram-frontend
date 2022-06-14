import { faApple, faInstagram } from '@fortawesome/free-brands-svg-icons'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthLayout from '../components/auth/AuthLayout'
import FormBox from '../components/auth/FormBox'
import Input from '../components/auth/Input'
import Button from '../components/auth/Button'
import Separator from '../components/auth/Separator'
import BottomBox from '../components/auth/BottomBox'
import routes from '../routes'
import PageTitle from '../components/PageTitle'
import { gql, useMutation } from '@apollo/client'
import { isLoggedInVar } from '../apollo'
import { LOCALSTORAGE_TOKEN } from '../constant'
import { useLocation } from 'react-router-dom'

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`
const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`

function Login() {
  const location = useLocation()
  console.log(location)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    // defaultValues: {
    //   username: location?.state?.username || '',
    //   password: location?.state?.password || '',
    // },
  })

  const onCompleted = (data) => {
    const {
      login: { ok, token, error },
    } = data
    if (!ok) {
      return { ok: false, error }
    }
    if (token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token)
      isLoggedInVar(true)
    }
    console.log(token)
    console.log(localStorage)
  }

  const onValid = (data) => {
    if (loading) {
      return
    }
    const { username, password } = getValues()
    login({
      variables: { username, password },
    })
  }

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  })
  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <span style={{ color: 'red', textDecoration: 'underline' }}>
          {location?.state?.message}
        </span>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register('username', { required: true, minLength: 5 })}
            type="text"
            placeholder="username"
          />
          {errors.username && (
            <span style={{ color: 'red', margin: '5px', fontSize: '12px' }}>
              This field is required and minLength is five!!
            </span>
          )}
          <Input
            {...register('password', { required: true, minLength: 5 })}
            type="password"
            placeholder="password"
          />
          {errors.pasword && (
            <span style={{ color: 'red', margin: '5px', fontSize: '12px' }}>
              This field is required and minLength is five!!
            </span>
          )}
          <Button type="submit" value="Log in" />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faApple} size="2x" />
          <span>Login in with AppleStore</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  )
}
export default Login
