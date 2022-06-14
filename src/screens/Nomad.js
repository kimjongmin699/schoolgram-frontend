import { isLoggedInVar } from '../apollo'

const Nomad = () => {
  return (
    <div>
      <h1>Nomad</h1>
      <button onClick={() => isLoggedInVar(false)}>Log in now</button>
    </div>
  )
}

export default Nomad
