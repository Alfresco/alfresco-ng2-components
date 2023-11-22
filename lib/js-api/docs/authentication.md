# Authentication JS-API

## Login

AlfrescoApi({alfrescoHost, activitiHost, contextRoot, ticket});

| Property        | Description                                                                                                                                  | default value         |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| hostEcm         | (Optional) The Ip or Name of the host where your Alfresco instance is running                                                                | http://127.0.0.1:8080 |
| hostBpm         | (Optional) The Ip or Name of the host where your Activiti instance is running                                                                | http://127.0.0.1:9999 |
| authType        | (Optional) can be 'BASIC' or 'OAUTH'                                                                                                         | 'BASIC'               |
| oauth2          | (Optional) configuration for SSO                                                                                                             |                       |
| contextRoot     | (Optional) that define the context Root of the Alfresco ECM API default value is alfresco                                                    | alfresco              |
| contextRootBpm  | (Optional) that define the context Root of the Activiti API default value is activiti-app                                                    | alfresco              |
| tenant          | (Optional) needed in case of multi tenant content service                                                                                    | '-default-'           |
| provider        | (Optional) default value is ECM. This parameter can accept as value ECM BPM or ALL to use the API and Login in the ECM, Activiti BPM or Both | alfresco              |
| ticket          | (Optional) only if you want login with the ticket see example below                                                                          |                       |
| disableCsrf     | To disable CSRF Token to be submitted. Only for Activiti call                                                                                | false                 |
| withCredentials | (Optional) configuration for SSO, requires CORS on ECM                                                                                       | false                 |
| oauthInit       | (Optional) if false skip the OAuth2 initialization                                                                                           | true                  |

### Login with Username and Password BPM and ECM

**Example**

```javascript
const alfrescoApi = new AlfrescoApi({ provider: 'ALL' });

try {
    await alfrescoJsApi.login('admin', 'admin');
    console.log('API called successfully Login in BPM and ECM performed ');
} catch (error) {
    console.error(error);
}
```

### Login with Username and Password ECM

**Example**

```javascript
const alfrescoJsApi = new AlfrescoApi();

try {
    const data = await alfrescoJsApi.login('admin', 'admin');
    
    console.log('API called successfully Login ticket:' + data);
    // The output will be: API called successfully Login ticket: TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1
} catch (error) {
    console.error(error);
}
```

### Login with ticket

If you already know thw ticket when you invoke the constructor you can pass it as parameter in the constructor otherwise you can call the login with ticket that will validate the ticket against the server

#### Login with ticket ECM

This authentication validate also the ticket against the server

**Example**

```javascript
const ticket = 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1';

try {
    await alfrescoJsApi.loginTicket(ticket);
    console.log('valid ticket you are logged in');
} catch (error) {
    console.error(error);
}
```

#### Login with ticket ECM/BPM as parameter in the constructor

With this authentication the ticket is not validated against the server

**Example**

```javascript

// Login with ECM ticket
const alfrescoApi = new AlfrescoApi({
    ticketEcm:'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1',
    hostEcm:'http://127.0.0.1:8080'
});

// Login with BPM ticket
const alfrescoApi = new AlfrescoApi({
    ticketBpm: 'Basic YWRtaW46YWRtaW4=',  
    hostBpm:'http://127.0.0.1:9999'
});

// Login with ECM and BPM tickets
const alfrescoApi = new AlfrescoApi({
    ticketEcm:'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1',
    ticketBpm: 'Basic YWRtaW46YWRtaW4=',  
    hostEcm:'http://127.0.0.1:8080',  
    hostBpm:'http://127.0.0.1:9999'
});
```

### Login with Username and Password BPM

**Example**

```javascript
const alfrescoApi = new AlfrescoApi({ provider:'BPM' });

try {
    await alfrescoJsApi.login('admin', 'admin');
    console.log('API called successfully Login in Activiti BPM performed ');
} catch (error) {
    console.error(error);
}
```

### Login with OAUTH2 Alfresco authorization server

#### Implicit Flow

If your want to redirect to the authorization server and login there, you can use the implicit flow to login

**oauth2 properties**

| Property                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Default Value                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| host                    | Your oauth2 server URL                                                                                                                                                                                                                                                                                                                                                                                                                                                            | null                            |
| clientId                | Your clientId oauth2                                                                                                                                                                                                                                                                                                                                                                                                                                                              | null                            |
| secret                  | Your secret oauth2                                                                                                                                                                                                                                                                                                                                                                                                                                                                | null                            |
| scope                   | Your scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | null                            |
| implicitFlow            | true/false                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | false                           |
| redirectUri             | url to be redirect after login                                                                                                                                                                                                                                                                                                                                                                                                                                                    | null                            |
| redirectLogout          | url to be redirect after logout optional, if is nor present the redirectUri will be used                                                                                                                                                                                                                                                                                                                                                                                          | null                            |
| refreshTokenTimeout     | millisecond value, after how many millisecond you want refresh the token                                                                                                                                                                                                                                                                                                                                                                                                          | 30000                           |
| redirectSilentIframeUri | url to be redirect after silent refresh login                                                                                                                                                                                                                                                                                                                                                                                                                                     | /assets/silent-refresh.html     |
| silentLogin             | direct execute the implicit login without the need to call AlfrescoJsApi.implicitLogin() method                                                                                                                                                                                                                                                                                                                                                                                   | false                           |
| publicUrls              | list of public urls that don't need authorization. It is possible too pass absolute paths and string patterns. In patterns you can use * or ** wildcards. Single means that you can have anything in one part of URL for example http://some-public-url/path/* matches with http://some-public-url/path/test. Double means that you can have anything in any number of parts, for example http://some-public-url/path/** matches with http://some-public-url/path/test/some-test. |
| authorizationUrl        | authorization url, relative to the host                                                                                                                                                                                                                                                                                                                                                                                                                                           | /protocol/openid-connect/auth   |
| tokenUrl                | token url, relative to the host                                                                                                                                                                                                                                                                                                                                                                                                                                                   | /protocol/openid-connect/token  |
| logoutUrl               | logout url, relative to the host                                                                                                                                                                                                                                                                                                                                                                                                                                                  | /protocol/openid-connect/logout |

The api/js-api will automatically redirect you to the login page anf refresh the token if necessary

**Events**

| Property          | Description                                                                                                  | Default Value |
|-------------------|--------------------------------------------------------------------------------------------------------------|---------------|
| implicit_redirect | triggered when the user is redirect to the auth server return url parameter of the redirect                  |               |
| discovery         | triggered when all the openId discovery url phase is terminated return an object with all the discovered url |               |
| token_issued      | triggered when a new token is issued                                                                         |               |

The api/js-api will automatically redirect you to the login page and refresh the token if necessary

**Example**

```javascript
const alfrescoApi = new AlfrescoApi({
    oauth2: {
        host: 'HOST_OAUTH2_SERVER',
        clientId: 'YOUR_CLIENT_ID',
        secret: 'SECRET',
        scope: 'openid',
        implicitFlow: true,
        redirectUri: 'YOUR_HOME_APP_URL',
        silentRefreshTimeout: '600000' //Optional parameter 10 minutes default value
    },
    authType: 'OAUTH',
    provider: 'ALL'
});

alfrescoJsApi.implicitLogin();
```

**Example skip login form (implicitFlow)**

```javascript
const alfrescoApi = new AlfrescoApi({
    oauth2: {
        host: 'HOST_OAUTH2_SERVER',
        clientId: 'YOUR_CLIENT_ID',
        secret: 'SECRET',
        scope: 'openid',
        implicitFlow: true,
        redirectUri: 'YOUR_HOME_APP_URL',
        silentRefreshTimeout: '600000', // Optional parameter 10 minutes default value,
        silentLogin: true,
        publicUrls: ['PUBLIC_URL', 'URL_PATTERN']
    },
    authType: 'OAUTH',
    provider: 'ALL'
});
```

#### Password Flow

If your auth endpoint is different from the standard one "/oauth/token" you can override it through the property authPath

**Example**

```javascript
const alfrescoApi = new AlfrescoApi({
    oauth2: {
        host: 'HOST_OAUTH2_SERVER',
        clientId: 'YOUR_CLIENT_ID',
        secret: 'SECRET',
        authPath:'my-custom-auth-endpoint/token'
    },
    authType: 'OAUTH',
    provider: 'ALL'
});

try {
    await alfrescoJsApi.login('admin', 'admin');
    console.log('API called successfully Login in with authorization server performed');
} catch (error) {
    console.error(error);
}
```

After the login if you want refresh your token you can use this call

**Example**

```javascript
try {
    await alfrescoJsApi.refreshToken();
    console.log('Your token has been refreshed');
} catch (error) {
    console.error(error);
}
```

## Logout

```javascript
alfrescoJsApi.logout();
```

**Example**

```javascript
try {
    await alfrescoJsApi.logout();
    console.log('Successfully logged out');
} catch (error) {
    console.error('Error logging out');
}
```

## isLoggedIn

```javascript
alfrescoJsApi.isLoggedIn()
```

Returns `true` if you are logged in, and `false` if you are not.

**Example**

```javascript

const isLoggedIn = alfrescoJsApi.isLoggedIn();

if (isLoggedIn) {
    console.log('You are logged in');
} else {
    console.log('You are not logged in');
}
```

## Get tickets

### getTicketEcm()

After the log in you can retrieve you ECM ticket

```javascript
const ecmTicket = alfrescoJsApi.getTicketEcm() ;

console.log('This is your  ECM ticket  ' + ecmTicket);
```

### getTicketBpm()

After the log in you can retrieve you BPM ticket

```javascript
const bpmTicket  = alfrescoJsApi.getTicketBpm();

console.log('This is your BPM ticket ' + bpmTicket);
```

**Events login/logout**

The login/logout are also an EventEmitter which you can register to listen to any of the following event types:

- unauthorized (If this event is triggered a call to the Api was unauthorized)
- success (If this event is triggered the login was success you can use this event > instead the login promise)
- logout (If this event is triggered the client is successfully logout)

**Example**

```javascript
alfrescoJsApi.login('admin', 'admin')
    .on('unauthorized', () => {
        console.log('You are unauthorized you can use this event to redirect to login');
    });

alfrescoJsApi.login('admin', 'admin')
    .on('success', () => {
        console.log('Success Login');
    });

alfrescoJsApi.logout()
    .on('logout', () => {
        console.log('Successfully Logout');
    });
```