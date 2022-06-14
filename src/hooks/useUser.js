import { gql, useQuery, useReactiveVar } from '@apollo/client'
import { useEffect } from 'react'
import { isLoggedInVar } from '../apollo'
import { LOCALSTORAGE_TOKEN } from '../constant'

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
      email
      totalFollowers
      totalFollowing
    }
  }
`
function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar)
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  })
  useEffect(() => {
    if (data?.me === null) {
      localStorage.removeItem(LOCALSTORAGE_TOKEN)
      isLoggedInVar(false)
    }
  }, [data])
  return { data }
}
export default useUser
