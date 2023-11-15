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

import assert from 'assert';
import { AlfrescoApi, Oauth2Auth } from '../src';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
chai.use(spies);

declare let window: any;
const globalAny: any = global;

describe('Oauth2 Implicit flow test', () => {
    let oauth2Auth: Oauth2Auth;
    let alfrescoJsApi: AlfrescoApi;
    let setItemSpy: any;

    beforeEach(() => {
        alfrescoJsApi = new AlfrescoApi({
            hostEcm: ''
        });

        setItemSpy = chai.spy.on(alfrescoJsApi.storage, 'setItem');
    });

    afterEach(() => {
        chai.spy.restore(alfrescoJsApi.storage, 'setItem');
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
        window = globalAny.window = { location: {} };
        globalAny.document = {
            getElementById: () => ''
        };

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
            expect(window.location.href).contain('https://myOauthUrl:30081/auth/realms/springboot/protocol/' + 'openid-connect/auth?');
            done();
        });

        oauth2Auth.implicitLogin();
    });

    it('should not loop over redirection when redirectUri contains hash and token is not valid ', (done) => {
        window = globalAny.window = { location: {} };
        globalAny.document = {
            getElementById: () => ''
        };
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

        oauth2Auth.on('implicit_redirect', () => {
            expect(window.location.href).contain('https://myOauthUrl:30081/auth/realms/springboot/protocol/' + 'openid-connect/auth?');
            expect(setItemSpy).to.have.been.called();
            done();
        });

        oauth2Auth.implicitLogin();
    });

    it('should not redirect to login if access token is valid', (done) => {
        window = globalAny.window = { location: {} };
        globalAny.document = {
            getElementById: () => ''
        };
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
            expect(window.location.url).to.be.equal(undefined);
            done();
        });

        oauth2Auth.setToken('new_token', 'new_refresh_token');

        oauth2Auth.implicitLogin();
    });

    it('should set the loginFragment to redirect after the login if it is present', (done) => {
        window = globalAny.window = {};
        globalAny.document = {
            getElementById: () => ''
        };
        window.location = <Location>{ hash: 'asfasfasfa' };

        Object.defineProperty(window.location, 'hash', {
            writable: true,
            value: '#/redirect-path&session_state=eqfqwfqwf'
        });

        Object.defineProperty(window.location, 'href', {
            writable: true,
            value: 'https://stoca/#/redirect-path&session_state=eqfqwfqwf'
        });

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
            expect(window.location.href).contain('https://myOauthUrl:30081/auth/realms/springboot/protocol/' + 'openid-connect/auth?');
            expect(setItemSpy).to.have.been.called.with('loginFragment', '/redirect-path&session_state=eqfqwfqwf');
            done();
        });

        oauth2Auth.implicitLogin();
    });
});
