import {
  makeVar,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { LOCALSTORAGE_TOKEN } from './constant'

export const darkModeVar = makeVar(false)

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

export const isLoggedInVar = makeVar(Boolean(token))

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://schoolgram-server-sexy.herokuapp.com/graphql'
      : 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(LOCALSTORAGE_TOKEN),
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`,
      },
    },
  }),
})
