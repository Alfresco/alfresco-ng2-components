---
Title: Authentication Configuration
---

# Authentication Configuration
This guide outlines the configuration of authentication methods within the application, focusing on OAuth2 and its parameters as defined in app.config.json. It also provides examples for integrating with different identity providers (IdPs) such as Keycloak and Auth0.

# Authentication Types
The authType parameter specifies the authentication method, with BASIC and OAUTH as possible values. The default setting is BASIC.

```json
{
    "authType": "OAUTH"
}
```
# OAuth2 Configuration
OAuth2 is a protocol that allows the application to authorize operations without exposing user credentials. The configuration includes several parameters essential for setting up OAuth2 authentication.

## Required Parameters

    
    host: The base URL of the authorization server.
    
    clientId: The ID assigned to the application by the authorization server.
    
    scope: The scope of the access request.
    
## Optional Parameters
    
    oidc: Defines the use of OpenID Connect during the implicit flow.
    
    issuer: The issuer's URI.
    
    silentLogin: Enables silent authentication.
    
    secret: The application's secret, used for secure authentication.
    
    redirectUri: Where to redirect after a successful login.
    
    postLogoutRedirectUri: Where to redirect after logging out.
    
    refreshTokenTimeout, silentRefreshRedirectUri, silentRefreshTimeout: Control refresh token behavior.
    
    publicUrls: URLs that do not require authentication.
    
    dummyClientSecret: A workaround for auth servers requiring a client secret for the password flow.
    
    skipIssuerCheck: Whether to skip issuer validation in the discovery document.
    
    strictDiscoveryDocumentValidation: Ensures all URLs in the discovery document start with the issuer's URL.
    
    implicitFlow, codeFlow: Configure the flow for authentication.
    
    logoutUrl: The URL for logging out.

    logoutParameters: Specifies parameters to be included in the logout request as an array of strings, such as ["client_id", "returnTo", "response_type"]. This allows for dynamic configuration of logout parameters tailored to specific IdP requirements.

    audience: Identifies the recipients of the token.

# Examples
## Keycloak Configuration
```json 
{
    "authType": "OAUTH",
    "oauth2": {
    "host": "{protocol}//{hostname}{:port}/auth/realms/alfresco",
    "clientId": "alfresco",
    "scope": "openid profile email",
    "implicitFlow": false,
    "codeFlow": true,
    "silentLogin": true,
    "publicUrls": ["**/preview/s/*", "**/settings"],
    "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
    "redirectUri": "/",
    "redirectUriLogout": "/",
    "skipIssuerCheck": true,
    "strictDiscoveryDocumentValidation": false
    }
}
```

## Auth0 Configuration
```json 
{
  "authType": "OAUTH",
  "oauth2": {
    "host": "https://your-idp.auth0.com",
    "clientId": "",
    "secret": "",
    "scope": "openid profile email offline_access",
    "implicitFlow": false,
    "codeFlow": true,
    "silentLogin": true,
    "publicUrls": [
      "**/preview/s/*",
      "**/settings"
    ],
    "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
    "redirectUri": "/",
    "redirectUriLogout": "/",
    "logoutUrl": "https://your-idp.auth0.com/v2/logout",
    "logoutParameters": ["client_id", "returnTo"],
    "audience": "http://localhost:3000",
    "skipIssuerCheck": true,
    "strictDiscoveryDocumentValidation": false
  }
}
```
## Cognito Configuration
```json
{
    "oauth2": {
        "host": "https://cognito-idp.your-idp-url",
        "clientId": "",
        "secret": "",
        "scope": "openid profile email",
        "implicitFlow": false,
        "codeFlow": true,
        "silentLogin": true,
        "publicUrls": ["**/preview/s/*", "**/settings"],
        "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
        "redirectUri": "http://your-env-name/view/authentication-confirmation/",
        "redirectUriLogout": "/",
        "logoutParameters": ["client_id", "redirect_uri", "response_type"],
        "logoutUrl": "https://your-idp-url/oauth2/logout",
        "skipIssuerCheck": true,
        "strictDiscoveryDocumentValidation": false
    }
}
```

### Handling Redirects with Amazon Cognito
When integrating with Amazon Cognito, special handling is required to ensure that the application can properly process authentication confirmation redirects, particularly when using hash-based routing in Angular applications. Due to Cognito's restrictions on redirect URLs, which do not allow fragments (#), you may encounter issues when the redirect URI points directly to a route within a single-page application (SPA) that relies on hash-based navigation.

To address this, include the following script tag within the <head> section of your index.html file. This script checks the current URL path for a specific pattern (view/authentication-confirmation) and modifies the URL to include a hash (#) if it's missing, ensuring the application correctly handles the redirect after Cognito authentication:

```html
<script>
    (function() {
        if (window.location.pathname.includes('view/authentication-confirmation') && !window.location.pathname.includes('#')) {
            window.location.replace('/#' + window.location.pathname + window.location.search);
        }
    })();
</script>
```



# Docker Environment Variables
These settings can be customized in a Docker environment using the following environment variables:

    APP_CONFIG_OAUTH2_HOST
    APP_CONFIG_OAUTH2_CLIENTID
    APP_CONFIG_OAUTH2_CLIENT_SECRET
    APP_CONFIG_OAUTH2_IMPLICIT_FLOW
    APP_CONFIG_OAUTH2_CODE_FLOW
    APP_CONFIG_OAUTH2_AUDIENCE
    APP_CONFIG_OAUTH2_SCOPE
    APP_CONFIG_OAUTH2_LOGOUT_URL
    APP_CONFIG_OAUTH2_LOGOUT_PARAMETERS
    APP_CONFIG_OAUTH2_SILENT_LOGIN
    APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI
    APP_CONFIG_OAUTH2_REDIRECT_LOGIN
    APP_CONFIG_OAUTH2_REDIRECT_LOGOUT

Adjust the above examples according to your specific environment and authentication provider settings. These configurations ensure that the application can securely authenticate users through OAuth2, aligning with the current best practices in web application security.
