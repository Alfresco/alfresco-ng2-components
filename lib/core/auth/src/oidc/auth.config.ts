// This api will come in the next version

import { AuthConfig } from 'angular-oauth2-oidc';

// export const authConfig: AuthConfig = {
//     issuer: 'http://localhost:5002/idp',
//     clientId: 'studio-client',
//     scope: 'openid profile email',
//     redirectUri: window.location.origin + '/#/view/authentication-confirmation',
//     // redirectUri: 'http://localhost:4200/#/view/authentication-confirmation',
//     postLogoutRedirectUri: window.location.origin + '/#/view/unauthenticated',
//     // postLogoutRedirectUri: 'http://localhost:4200/#/view/unauthenticated',
//     silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
//     showDebugInformation: true,
//     responseType: 'code',
//     dummyClientSecret: 'secret-123'
// };

export const authConfig: AuthConfig = {
    issuer: 'https://apadev.envalfresco.com/auth/realms/alfresco',
    redirectUri: window.location.origin + '/#/view/authentication-confirmation',
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    clientId: 'alfresco',
    postLogoutRedirectUri: '#/logout',
    scope: 'openid profile email',
    dummyClientSecret: '',
    responseType: 'code'
};
