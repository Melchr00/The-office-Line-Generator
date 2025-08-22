import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider} from "react-oidc-context";

const oidcConfig = {
  authority: `${import.meta.env.VITE_KEYCLOAK_BASE_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  pkce_method: "S256",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
    <App />
    </AuthProvider>
  </StrictMode>,
)
