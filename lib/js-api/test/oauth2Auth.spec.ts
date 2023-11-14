/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApi } from '../src/alfrescoApi';
import { Oauth2Auth } from '../src/authentication/oauth2Auth';
import { ContentApi } from '../src/api/content-custom-api/api/content.api';
import { EcmAuthMock, OAuthMock } from '../test/mockObjects';
import { PathMatcher } from '../src/utils/path-matcher';
import chai, { expect } from 'chai';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const globalAny: any = global;

describe('Oauth2  test', () => {
    let alfrescoJsApi: AlfrescoApi;
    let oauth2Mock: OAuthMock;
    let authResponseMock: EcmAuthMock;

    beforeEach(() => {
        const hostOauth2 = 'https://myOauthUrl:30081';
        const mockStorage = {
            getItem: () => {},
            setItem: () => {}
        };

        oauth2Mock = new OAuthMock(hostOauth2);
        authResponseMock = new EcmAuthMock(hostOauth2);

        alfrescoJsApi = new AlfrescoApi({
            hostEcm: 'myecm'
        });

        alfrescoJsApi.storage.setStorage(mockStorage);
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

            expect(oauth2Auth.discovery.loginUrl).to.be.equal(host + Oauth2Auth.DEFAULT_AUTHORIZATION_URL);
            expect(oauth2Auth.discovery.tokenEndpoint).to.be.equal(host + Oauth2Auth.DEFAULT_TOKEN_URL);
            expect(oauth2Auth.discovery.logoutUrl).to.be.equal(host + Oauth2Auth.DEFAULT_LOGOUT_URL);
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

            expect(oauth2Auth.discovery.loginUrl).to.be.equal(authorizationUrl);
            expect(oauth2Auth.discovery.tokenEndpoint).to.be.equal(tokenUrl);
            expect(oauth2Auth.discovery.logoutUrl).to.be.equal(logoutUrl);
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

            expect(loginInstanceOne.access_token).to.be.equal('superman-token');
            expect(loginInstanceTwo.access_token).to.be.equal('barman-token');

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
                expect(data.access_token).to.be.equal('test-token');
                oauth2Auth.logOut();
                done();
            });
        });

        it('should refresh token when the login not use the implicitFlow ', function (done) {
            this.timeout(3000);
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

            const refreshSpy = chai.spy.on(oauth2Auth, 'refreshToken');

            setTimeout(() => {
                expect(refreshSpy).to.have.been.called.min(2);
                oauth2Auth.logOut();
                done();
            }, 600);

            oauth2Auth.login('admin', 'admin');
        });

        it('should not hang the app also if teh logout is missing', function (done) {
            this.timeout(3000);
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

            const refreshSpy = chai.spy.on(oauth2Auth, 'refreshToken');

            setTimeout(() => {
                expect(refreshSpy).to.have.been.called.min(2);
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

            expect(counterCallEvent).to.be.equal(1);

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
                expect(alfrescoApi.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                expect(alfrescoApi.contentClient.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const content = new ContentApi(alfrescoApi);
                const URL = content.getContentUrl('FAKE-NODE-ID');
                expect(URL).to.be.equal(
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
                expect(alfrescoApi.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                expect(alfrescoApi.contentClient.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const URL = contentApi.getContentUrl('FAKE-NODE-ID');
                expect(URL).to.be.equal(
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
            this.timeout(3000);

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
                expect(alfrescoApi.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                expect(alfrescoApi.contentClient.config.ticketEcm).to.be.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');

                const content = new ContentApi(alfrescoApi);
                const URL = content.getContentUrl('FAKE-NODE-ID');
                expect(URL).to.be.equal(
                    'https://myOauthUrl:30081/alfresco/api/-default-/public/alfresco/versions/1/nodes/FAKE-NODE-ID/content?attachment=false&alf_ticket=TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1'
                );

                counterCallEvent++;

                if (counterCallEvent === 2) {
                    done();
                }
            });

            alfrescoApi.login('admin', 'admin');
            this.timeout(3000);
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
                expect(oauth2Auth.isLoggedIn()).to.be.equal(true);
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
                expect(oauth2Auth.authentications.basicAuth.password).to.be.not.equal('admin');
                oauth2Auth.logOut();
                done();
            });
        });

        describe('With mocked DOM', () => {
            beforeEach(() => {
                const dom = new JSDOM('', { url: 'https://localhost' });
                globalAny.window = dom.window;
                globalAny.document = dom.window.document;
            });

            it('a failed hash check calls the logout', () => {
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

                // define spy on logOut
                const logoutSpy = chai.spy.on(oauth2Auth, 'logOut');

                // invalid hash location leads to a reject which leads to a log out
                oauth2Auth.iFrameHashListener();
                setTimeout(() => {
                    expect(logoutSpy).to.have.been.called();
                }, 500);
            });

            afterEach(() => {
                globalAny.window = undefined;
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
            });

            it('should return true if PathMatcher.match returns true for matching url', () => {
                globalAny.window = { location: { href: 'public-url' } };
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];
                chai.spy.on(PathMatcher, 'match', () => true);

                expect(oauth2Auth.isPublicUrl()).be.true;
                expect(PathMatcher.match).called.with(globalAny.window.location.href, oauth2Auth.config.oauth2.publicUrls[0]);
            });

            it('should return false if PathMatcher.match returns false for matching url', () => {
                globalAny.window = { location: { href: 'some-public-url' } };
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];
                chai.spy.on(PathMatcher, 'match', () => false);

                expect(oauth2Auth.isPublicUrl()).be.false;
                expect(PathMatcher.match).called.with(globalAny.window.location.href, oauth2Auth.config.oauth2.publicUrls[0]);
            });

            it('should return false if publicUrls property is not defined', () => {
                chai.spy.on(PathMatcher, 'match');

                expect(oauth2Auth.isPublicUrl()).be.false;
                expect(PathMatcher.match).not.called();
            });

            it('should return false if public urls is not set as an array list', () => {
                globalAny.window = { location: { href: 'public-url-string' } };
                oauth2Auth.config.oauth2.publicUrls = null;
                chai.spy.on(PathMatcher, 'match');

                expect(oauth2Auth.isPublicUrl()).be.false;
                expect(PathMatcher.match).not.called();
            });

            it('should not call `implicitLogin`', async () => {
                globalAny.window = { location: { href: 'public-url' } };
                oauth2Auth.config.oauth2.silentLogin = true;
                oauth2Auth.config.oauth2.publicUrls = ['public-url'];
                chai.spy.on(PathMatcher, 'match', () => true);
                const implicitLoginSpy = chai.spy.on(oauth2Auth, 'implicitLogin');

                await oauth2Auth.checkFragment();
                expect(implicitLoginSpy).not.to.have.been.called();
                expect(PathMatcher.match).called.with(globalAny.window.location.href, oauth2Auth.config.oauth2.publicUrls[0]);
            });

            afterEach(() => {
                chai.spy.restore(PathMatcher, 'match');
            });
        });
    });
});
