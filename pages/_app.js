import React from 'react'
import '../styles/globals.css'
import Amplify from 'aws-amplify'
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
} from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import config from '../aws-exports'
Amplify.configure(config)
function MyApp({ Component, pageProps }) {
  const [authState, setAuthState] = React.useState()
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)

      if (nextAuthState === AuthState.SignedIn) {
        const { email, sub, ...attributes } = authData.attributes

        setUser({ email, username: sub, attributes })
      }
    })
  }, [])

  return authState === AuthState.SignedIn && user ? (
    <main>
      hello
      <AmplifySignOut />
      <Component {...pageProps} />
    </main>
  ) : (
    <main>
      <header>
        <h1 style={{ textAlign: 'center' }}>Welcome to my app!</h1>
      </header>
      <main>
        <AmplifyAuthenticator>
          <AmplifySignUp
            slot="sign-up"
            formFields={[
              { type: 'username' },
              { type: 'email' },
              { type: 'password' },
            ]}
          />
        </AmplifyAuthenticator>
      </main>
      <footer>Hello I'm a footer</footer>
    </main>
  )
}

export default MyApp
