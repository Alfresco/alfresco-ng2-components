/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApi, ContentApi, Oauth2Auth } from '../src';
import { EcmAuthMock, OAuthMock } from './mockObjects';
import { jest } from '@jest/globals';

describe('Oauth2  test', () => {
    let alfrescoJsApi: AlfrescoApi;
    let oauth2Mock: OAuthMock;
    let authResponseMock: EcmAuthMock;

    beforeEach(() => {
        const hostOauth2 = 'https://myOauthUrl:30081';
        const mockStorage = {
            getItem: () => {},
            setItem: () => {},
            removeItem: () => {}
        };

        oauth2Mock = new OAuthMock(hostOauth2);
        authResponseMock = new EcmAuthMock(hostOauth2);

        alfrescoJsApi = new AlfrescoApi({
            hostEcm: 'myecm'
        });

        alfrescoJsApi.storage.setStorage(mockStorage);
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                ancestorOrigins: null,
                hash: null,
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

    afterEach(() => {
        authResponseMock.cleanAll();
        jest.clearAllMocks();
    });

    describe('Discovery urls', () => {
        const authType = 'OAUTH';
        const host = 'https://dummy/auth';
        const clientId = 'dummy';
        const scope = 'openid';
        const redirectUri = '/';

        it('should have default urls', async () => {
            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host,
                        clientId,
                        scope,
                        redirectUri
                    },
                    authType
                },
                alfrescoJsApi
            );

            assert.equal(oauth2Auth.discovery.loginUrl, host + Oauth2Auth.DEFAULT_AUTHORIZATION_URL);
            assert.equal(oauth2Auth.discovery.tokenEndpoint, host + Oauth2Auth.DEFAULT_TOKEN_URL);
            assert.equal(oauth2Auth.discovery.logoutUrl, host + Oauth2Auth.DEFAULT_LOGOUT_URL);
        });

        it('should be possible to override the default urls', async () => {
            const authorizationUrl = '/custom-login';
            const logoutUrl = '/custom-logout';
            const tokenUrl = '/custom-token';
            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host,
                        authorizationUrl,
                        logoutUrl,
                        tokenUrl,
                        clientId,
                        scope,
                        redirectUri
                    },
                    authType
                },
                alfrescoJsApi
            );

            assert.equal(oauth2Auth.discovery.loginUrl, authorizationUrl);
            assert.equal(oauth2Auth.discovery.tokenEndpoint, tokenUrl);
            assert.equal(oauth2Auth.discovery.logoutUrl, logoutUrl);
        });
    });

    describe('With Authentication', () => {
        it('should be possible have different user login in different instance of the oauth2Auth class', async () => {
            const oauth2AuthInstanceOne = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            const oauth2AuthInstanceTwo = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            const mock = new OAuthMock('https://myOauthUrl:30081');
            mock.get200Response('superman-token');
            const loginInstanceOne = await oauth2AuthInstanceOne.login('superman', 'crypto');

            mock.get200Response('barman-token');
            const loginInstanceTwo = await oauth2AuthInstanceTwo.login('barman', 'IamBarman');

            assert.equal(loginInstanceOne.access_token, 'superman-token');
            assert.equal(loginInstanceTwo.access_token, 'barman-token');

            oauth2AuthInstanceOne.logOut();
            oauth2AuthInstanceTwo.logOut();
        });

        it('login should return the Token if is ok', (done) => {
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.login('admin', 'admin').then((data) => {
                assert.equal(data.access_token, 'test-token');
                oauth2Auth.logOut();
                done();
            });
        });

        it('should refresh token when the login not use the implicitFlow ', (done) => {
            jest.spyOn(window, 'document', 'get').mockReturnValueOnce(undefined);
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout',
                        implicitFlow: false,
                        refreshTokenTimeout: 100
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            let calls = 0;
            oauth2Auth.refreshToken = () => {
                calls++;
                return Promise.resolve();
            };

            setTimeout(() => {
                assert.equal(calls > 2, true);
                oauth2Auth.logOut();
                done();
            }, 600);

            oauth2Auth.login('admin', 'admin');
        });

        it('should not hang the app also if the logout is missing', (done) => {
            jest.spyOn(window, 'document', 'get').mockReturnValueOnce(undefined);
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout',
                        implicitFlow: false,
                        refreshTokenTimeout: 100
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            let calls = 0;
            oauth2Auth.refreshToken = () => {
                calls++;
                return Promise.resolve();
            };

            setTimeout(() => {
                assert.equal(calls > 2, true);
                done();
            }, 600);

            oauth2Auth.login('admin', 'admin');
        });

        it('should emit a token_issued event if login is ok ', (done) => {
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.once('token_issued', () => {
                oauth2Auth.logOut();
                done();
            });

            oauth2Auth.login('admin', 'admin');
        });

        it('should not emit a token_issued event if setToken is null ', (done) => {
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            let counterCallEvent = 0;
            oauth2Auth.once('token_issued', () => {
                counterCallEvent++;
            });

            oauth2Auth.setToken(null, null);
            oauth2Auth.setToken('200', null);
            oauth2Auth.setToken(null, null);

            assert.equal(counterCallEvent, 1);

            done();
        });

        it('should emit a token_issued if provider is ECM', (done) => {
            oauth2Mock.get200Response();
            authResponseMock.get200ValidTicket();

            const oauth2Auth = new Oauth2Auth(
                {
                    provider: 'ECM',
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.once('token_issued', () => {
                oauth2Auth.logOut();
                done();
            });

            oauth2Auth.login('admin', 'admin');
        });

        it('should emit a token_issued if provider is ALL', (done) => {
            oauth2Mock.get200Response();
            authResponseMock.get200ValidTicket();
            const oauth2Auth = new Oauth2Auth(
                {
                    provider: 'ALL',
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.once('token_issued', () => {
                oauth2Auth.logOut();
                done();
            });

            oauth2Auth.login('admin', 'admin');
        });

        it('should after token_issued event exchange the access_token for the alf_ticket', (done) => {
            oauth2Mock.get200Response();
            authResponseMock.get200ValidTicket();

            const alfrescoApi = new AlfrescoApi({
                hostEcm: 'https://myOauthUrl:30081',
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    scope: 'openid',
                    secret: '',
                    redirectUri: '/',
                    redirectUriLogout: '/logout'
                },
                authType: 'OAUTH'
            });

            alfrescoApi.oauth2Auth.on('ticket_exchanged', () => {
                assert.equal(alfrescoApi.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                assert.equal(alfrescoApi.contentClient.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const content = new ContentApi(alfrescoApi);
                const URL = content.getContentUrl('FAKE-NODE-ID');
                assert.equal(
                    URL,
                    'https://myOauthUrl:30081/alfresco/api/-default-/public/alfresco/versions/1/nodes/FAKE-NODE-ID/content?attachment=false&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
                );

                alfrescoApi.oauth2Auth.logOut();
                done();
            });

            alfrescoApi.login('admin', 'admin');
        });

        it('should after token_issued event exchange the access_token for the alf_ticket with the compatibility layer', (done) => {
            oauth2Mock.get200Response();
            authResponseMock.get200ValidTicket();

            const alfrescoApi = new AlfrescoApi({
                hostEcm: 'https://myOauthUrl:30081',
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    scope: 'openid',
                    secret: '',
                    redirectUri: '/',
                    redirectUriLogout: '/logout'
                },
                authType: 'OAUTH'
            });

            const contentApi = new ContentApi(alfrescoApi);

            alfrescoApi.oauth2Auth.on('ticket_exchanged', () => {
                assert.equal(alfrescoApi.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                assert.equal(alfrescoApi.contentClient.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const URL = contentApi.getContentUrl('FAKE-NODE-ID');
                assert.equal(
                    URL,
                    'https://myOauthUrl:30081/alfresco/api/-default-/public/alfresco/versions/1/nodes/FAKE-NODE-ID/content?attachment=false&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
                );
                alfrescoApi.oauth2Auth.logOut();

                done();
            });

            alfrescoApi.login('admin', 'admin');
        });

        // TODO: very flaky test, fails on different machines if running slow, might relate to `this.timeout`
        // eslint-disable-next-line ban/ban
        xit('should extend content session after oauth token refresh', function (done) {
            jest.setTimeout(3000);

            oauth2Mock.get200Response();
            authResponseMock.get200ValidTicket();

            const alfrescoApi = new AlfrescoApi({
                hostEcm: 'https://myOauthUrl:30081',
                oauth2: {
                    host: 'https://myOauthUrl:30081/auth/realms/springboot',
                    clientId: 'activiti',
                    scope: 'openid',
                    secret: '',
                    redirectUri: '/',
                    redirectUriLogout: '/logout'
                },
                authType: 'OAUTH'
            });

            let counterCallEvent = 0;
            alfrescoApi.oauth2Auth.on('ticket_exchanged', () => {
                assert.equal(alfrescoApi.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                assert.equal(alfrescoApi.contentClient.config.ticketEcm, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const content = new ContentApi(alfrescoApi);
                const URL = content.getContentUrl('FAKE-NODE-ID');
                assert.equal(
                    URL,
                    'https://myOauthUrl:30081/alfresco/api/-default-/public/alfresco/versions/1/nodes/FAKE-NODE-ID/content?attachment=false&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
                );

                counterCallEvent++;

                if (counterCallEvent === 2) {
                    done();
                }
            });

            alfrescoApi.login('admin', 'admin');
            jest.setTimeout(3000);
            alfrescoApi.refreshToken();
        });

        it('isLoggedIn should return true if the api is logged in', (done) => {
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.login('admin', 'admin').then(() => {
                assert.equal(oauth2Auth.isLoggedIn(), true);
                oauth2Auth.logOut();
                done();
            });
        });

        it('login password should be removed after login', (done) => {
            oauth2Mock.get200Response();

            const oauth2Auth = new Oauth2Auth(
                {
                    oauth2: {
                        host: 'https://myOauthUrl:30081/auth/realms/springboot',
                        clientId: 'activiti',
                        scope: 'openid',
                        secret: '',
                        redirectUri: '/',
                        redirectUriLogout: '/logout'
                    },
                    authType: 'OAUTH'
                },
                alfrescoJsApi
            );

            oauth2Auth.login('admin', 'admin').then(() => {
                assert.notEqual(oauth2Auth.authentications.basicAuth.password, 'admin');
                oauth2Auth.logOut();
                done();
            });
        });

        describe('With mocked DOM', () => {
            it('a failed hash check calls the logout', (done) => {
                const oauth2Auth = new Oauth2Auth(
                    {
                        oauth2: {
                            host: 'https://myOauthUrl:30081/auth/realms/springboot',
                            clientId: 'activiti',
                            scope: 'openid',
                            secret: '',
                            redirectUri: '/',
                            redirectUriLogout: '/logout'
                        },
                        authType: 'OAUTH'
                    },
                    alfrescoJsApi
                );

                oauth2Auth.createIframe();

                const iframe = <HTMLIFrameElement>document.getElementById('silent_refresh_token_iframe');
                iframe.contentWindow.location.hash = 'invalid';

                let logoutCalled = false;
                oauth2Auth.logOut = () => {
                    logoutCalled = true;
                    return Promise.resolve();
                };

                // invalid hash location leads to a reject which leads to a logout
                oauth2Auth.iFrameHashListener();
                assert.equal(logoutCalled, true);
                done();
            });
        });

        describe('public urls', () => {
            let oauth2Auth: Oauth2Auth;

            beforeEach(() => {
                oauth2Auth = new Oauth2Auth(
                    {
                        oauth2: {
                            host: 'https://myOauthUrl:30081/auth/realms/springboot',
                            clientId: 'activiti',
                            scope: 'openid',
                            secret: '',
                            redirectUri: '/',
                            redirectUriLogout: '/logout'
                        },
                        authType: 'OAUTH'
                    },
                    alfrescoJsApi
                );
                window.location.assign('public-url');
            });

            it('should return true if PathMatcher.match returns true for matching url', () => {
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];
                oauth2Auth.pathMatcher = {
                    match: () => true
                };

                assert.equal(oauth2Auth.isPublicUrl(), true);
            });

            it('should return false if PathMatcher.match returns false for matching url', () => {
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];
                oauth2Auth.pathMatcher = {
                    match: () => false
                };

                assert.equal(oauth2Auth.isPublicUrl(), false);
            });

            it('should return false if publicUrls property is not defined', () => {
                assert.equal(oauth2Auth.isPublicUrl(), false);
            });

            it('should return false if public urls is not set as an array list', () => {
                oauth2Auth.config.oauth2.publicUrls = null;
                assert.equal(oauth2Auth.isPublicUrl(), false);
            });

            it('should not call `implicitLogin`', async () => {
                oauth2Auth.config.oauth2.silentLogin = true;
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];

                oauth2Auth.pathMatcher = {
                    match: () => true
                };

                let implicitLoginCalled = false;
                oauth2Auth.implicitLogin = () => {
                    implicitLoginCalled = true;
                };

                await oauth2Auth.checkFragment();
                assert.equal(implicitLoginCalled, false);
            });
        });
    });
});
