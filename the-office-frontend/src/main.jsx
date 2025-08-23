/***
 * Application entry point.
 * Sets up React rendering and configures authentication
 * using Keycloak through react-oidc-context.
 ***/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";

/**
 * OIDC configuration for Keycloak.
 * Uses environment variables so sensitive values
 * are not hardcoded into the frontend.
 */
const oidcConfig = {
  authority: `${import.meta.env.VITE_KEYCLOAK_BASE_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  pkce_method: "S256",
  onSigninCallback: () => {
    // Remove query params from URL after login to keep it clean
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
/**
 * Mounts the React app inside #root.
 * Wrapped in StrictMode for highlighting potential issues,
 * and AuthProvider so authentication state is available throughout the app.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
