import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { client, darkModeVar, isLoggedInVar } from './apollo'
import Home from './screens/Home'
import Login from './screens/Login'
import { useReactiveVar, ApolloProvider } from '@apollo/client'
import Nomad from './screens/Nomad'
import { ThemeProvider } from 'styled-components'
import { darkTheme, GlobalStyles, lightTheme } from './styles'
import SignUp from './screens/SignUp'
import routes from './routes'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import Profile from './screens/Profile'

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  const darkMode = useReactiveVar(darkModeVar)

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route
                path={routes.home}
                exact
                element={
                  isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Layout>
                      <Login />
                    </Layout>
                  )
                }
              />
              {isLoggedIn ? null : (
                <Route path={routes.signUp} element={<SignUp />} />
              )}

              <Route
                path={`/users/:username`}
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />

              <Route path="/nomad" element={<Nomad />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  )
}

export default App
