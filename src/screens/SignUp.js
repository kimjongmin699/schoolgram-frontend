import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AuthLayout from '../components/auth/AuthLayout'
import BottomBox from '../components/auth/BottomBox'
import Button from '../components/auth/Button'
import FormBox from '../components/auth/FormBox'
import Input from '../components/auth/Input'
import PageTitle from '../components/PageTitle'
import routes from '../routes'
import { FatLink } from '../styles'
import { gql , useMutation} from '@apollo/client'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(username: $username, email: $email, password: $password) {
      ok
    }
  }
`

function SignUp() {
  const navigate = useNavigate()
  const onCompleted = (data) => {
    const { username, password } = getValues()
    const {
      createAccount: { ok },
    } = data
    if (!ok) {
      return
    }
    navigate(routes.home, {
      state: { message: 'Account created. Please log in', username, password },
    })
  }
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })
  const onValid = (data) => {
    if (loading) {
      return
    }
    const { username, email, password } = getValues()
    createAccount({
      variables: {
        username,
        email,
        password,
      },
    })
  }
  return (
    <AuthLayout>
      <PageTitle title="SignUp" />
      <Helmet>Sign Up</Helmet>
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register('email', { required: true, minLength: 5 })}
            type="text"
            placeholder="Email"
          />
          {errors.email && (
            <span style={{ color: 'red', margin: '5px', fontSize: '12px' }}>
              This field is required and minLength is five!!
            </span>
          )}
          <Input
            {...register('username', { required: true, minLength: 5 })}
            type="text"
            placeholder="Username"
          />
          {errors.username && (
            <span style={{ color: 'red', margin: '5px', fontSize: '12px' }}>
              This field is required and minLength is five!!
            </span>
          )}
          <Input
            {...register('password', { required: true, minLength: 5 })}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span style={{ color: 'red', margin: '5px', fontSize: '12px' }}>
              This field is required and minLength is five!!
            </span>
          )}
          <Button type="submit" value="Sign Up" />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log In" link={routes.home} />
    </AuthLayout>
  )
}

export default SignUp
