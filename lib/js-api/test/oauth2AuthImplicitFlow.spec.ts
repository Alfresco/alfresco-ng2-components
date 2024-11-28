/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import assert from 'assert';
import { AlfrescoApi, Oauth2Auth } from '../src';

describe('Oauth2 Implicit flow test', () => {
    let oauth2Auth: Oauth2Auth;
    let alfrescoJsApi: AlfrescoApi;

    beforeEach(() => {
        alfrescoJsApi = new AlfrescoApi({
            hostEcm: ''
        });
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                ancestorOrigins: null,
                hash: '',
                host: 'dummy.com',
                port: '80',
                protocol: 'http:',
                hostname: 'dummy.com',
                href: 'http://localhost/',
                origin: 'dummy.com',
                pathname: null,
                search: null,
                assign: (url: string) => {
                    window.location.href = url;
                },
                reload: null,
                replace: null
            }
        });
    });

    it('should throw an error if redirectUri is not present', (done) => {
        try {
            oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        secret: '',
                        scope: 'openid',
                        implicitFlow: true,
                        redirectUri: undefined
                    }
                },
                alfrescoJsApi
            );
        } catch (error) {
            assert.equal(error.message, 'Missing redirectUri required parameter');
            done();
        }
    });

    it('should redirect to login if access token is not valid', (done) => {
        document.getElementById = () => null;

        oauth2Auth = new Oauth2Auth(
            {
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    secret: '',
                    scope: 'openid',
                    implicitFlow: true,
                    redirectUri: 'redirectUri'
                }
            },
            alfrescoJsApi
        );

        oauth2Auth.on('implicit_redirect', () => {
            assert.equal(window.location.href.includes('https://myOauthUrl:30081/auth/realms/springboot/protocol/openid-connect/auth?'), true);
            done();
        });

        oauth2Auth.implicitLogin();
    });

    it('should not loop over redirection when redirectUri contains hash and token is not valid ', (done) => {
        document.getElementById = () => null;
        oauth2Auth = new Oauth2Auth(
            {
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    secret: '',
                    scope: 'openid',
                    implicitFlow: true,
                    redirectUri: '#/redirectUri'
                }
            },
            alfrescoJsApi
        );

        let setItemCalled = false;
        alfrescoJsApi.storage.setItem = () => (setItemCalled = true);

        oauth2Auth.on('implicit_redirect', () => {
            assert.equal(window.location.href.includes('https://myOauthUrl:30081/auth/realms/springboot/protocol/openid-connect/auth?'), true);
            assert.equal(setItemCalled, true);
            done();
        });

        oauth2Auth.implicitLogin();
    });

    it('should not redirect to login if access token is valid', (done) => {
        document.getElementById = () => null;
        oauth2Auth = new Oauth2Auth(
            {
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    secret: '',
                    scope: 'openid',
                    implicitFlow: true,
                    redirectUri: 'redirectUri'
                }
            },
            alfrescoJsApi
        );

        oauth2Auth.isValidAccessToken = () => true;
        oauth2Auth.isValidToken = () => true;

        oauth2Auth.on('token_issued', () => {
            assert.equal(window.location.href, 'http://localhost/');
            done();
        });

        oauth2Auth.setToken('new_token', 'new_refresh_token');

        oauth2Auth.implicitLogin();
    });

    it('should set the loginFragment to redirect after the login if it is present', (done) => {
        document.getElementById = () => null;
        window.location.hash = '#/redirect-path&session_state=eqfqwfqwf';
        window.location.href = 'https://stoca/#/redirect-path&session_state=eqfqwfqwf';

        oauth2Auth = new Oauth2Auth(
            {
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    secret: '',
                    scope: 'openid',
                    implicitFlow: true,
                    redirectUri: 'redirectUri'
                }
            },
            alfrescoJsApi
        );

        let lastValues: [string, any];
        alfrescoJsApi.storage.setItem = (key, value) => (lastValues = [key, value]);

        oauth2Auth.on('implicit_redirect', () => {
            assert.equal(window.location.href.includes('https://myOauthUrl:30081/auth/realms/springboot/protocol/openid-connect/auth?'), true);
            assert.deepEqual(lastValues, ['loginFragment', '/redirect-path&session_state=eqfqwfqwf']);
            done();
        });

        oauth2Auth.implicitLogin();
    });
});
