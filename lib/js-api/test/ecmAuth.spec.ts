/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { resetGlobalMockAgent } from './mockObjects/base.mock';
import { AlfrescoApi, ContentAuth } from '../src';
import { EcmAuthMock as AuthEcmMock } from '../test/mockObjects';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Ecm Auth test', () => {
    const hostEcm = 'https://127.0.0.1:8080';

    let alfrescoJsApi: AlfrescoApi;
    let authEcmMock: AuthEcmMock;
    let contentAuth: ContentAuth;

    beforeEach(() => {
        authEcmMock = new AuthEcmMock(hostEcm);

        alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        contentAuth = new ContentAuth(
            {
                contextRoot: 'alfresco',
                hostEcm
            },
            alfrescoJsApi
        );
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    it('should remember username on login', () => {
        const auth = new ContentAuth({}, alfrescoJsApi);
        auth.login('johndoe', 'password');
        assert.equal(auth.authentications.basicAuth.username, 'johndoe');
    });

    it('should forget username on logout', async () => {
        const auth = new ContentAuth({}, alfrescoJsApi);

        authEcmMock.get201Response();

        auth.login('johndoe', 'password');
        assert.equal(auth.authentications.basicAuth.username, 'johndoe');

        authEcmMock.get204ResponseLogout();

        auth.logout().then(() => {
            assert.equal(auth.authentications.basicAuth.username, null);
            
        });
    });

    describe('With Authentication', () => {
        it('login should return the Ticket if all is ok', async () => {
            authEcmMock.get201Response();

            contentAuth.login('admin', 'admin').then((data) => {
                assert.equal(data, 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
                
            });
        });

        it('login password should be removed after login', async () => {
            authEcmMock.get201Response();

            contentAuth.login('admin', 'admin').then(() => {
                assert.notEqual(contentAuth.authentications.basicAuth.password, 'admin');
                
            });
        });

        it('isLoggedIn should return true if the api is logged in', async () => {
            authEcmMock.get201Response();

            contentAuth.login('admin', 'admin').then(() => {
                assert.equal(contentAuth.isLoggedIn(), true);
                
            });
        });

        it('isLoggedIn should return false if the host change', async () => {
            authEcmMock.get201Response();

            contentAuth.login('admin', 'admin').then(() => {
                assert.equal(contentAuth.isLoggedIn(), true);
                contentAuth.changeHost();
                assert.equal(contentAuth.isLoggedIn(), false);
                
            });
        });

        it('isLoggedIn should return false if the api is logged out', async () => {
            authEcmMock.get201Response();

            contentAuth.login('admin', 'admin');

            authEcmMock.get204ResponseLogout();

            contentAuth.logout().then(() => {
                assert.equal(contentAuth.isLoggedIn(), false);
                
            });
        });

        it('login should return an error if wrong credential are used 403 the login fails', async () => {
            authEcmMock.get403Response();

            contentAuth.login('wrong', 'name').then(
                () => {},
                (error: any) => {
                    assert.equal(error.status, 403);
                    
                }
            );
        });

        it('login should return an error if wrong credential are used 400 userId and/or password are/is not provided', async () => {
            authEcmMock.get400Response();

            contentAuth.login(null, null).then(
                () => {},
                (error) => {
                    assert.equal(error.status, 400);
                    
                }
            );
        });

        describe('Events ', () => {
            it('login should fire an event if is unauthorized  401', async () => {
                authEcmMock.get401Response();

                const loginPromise: any = contentAuth.login('wrong', 'name');
                loginPromise.catch(() => {});

                loginPromise.on('unauthorized', () => {
                    
                });
            });

            it('login should fire an event if is forbidden 403', async () => {
                authEcmMock.get403Response();

                const loginPromise: any = contentAuth.login('wrong', 'name');

                loginPromise.catch(() => {});

                loginPromise.on('forbidden', () => {
                    
                });
            });

            it('The Api Should fire success event if is all ok 201', async () => {
                authEcmMock.get201Response();

                const loginPromise: any = contentAuth.login('admin', 'admin');

                loginPromise.catch(() => {});

                loginPromise.on('success', () => {
                    
                });
            });

            it('The Api Should fire logout event if the logout is successfull', async () => {
                authEcmMock.get201Response();
                contentAuth.login('admin', 'admin');
                authEcmMock.get204ResponseLogout();

                (contentAuth.logout() as any).on('logout', () => {
                    
                });
            });
        });

        describe('With Ticket Authentication', () => {
            it('Ticket should be present in the client', () => {
                authEcmMock.get400Response();

                contentAuth = new ContentAuth(
                    {
                        ticketEcm: 'TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1',
                        hostEcm
                    },
                    alfrescoJsApi
                );

                assert.equal('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1', contentAuth.authentications.basicAuth.password);
            });
        });

        describe('Logout Api', () => {
            beforeEach(async () => {
                authEcmMock.get201Response('TICKET_22d7a5a83d78b9cc9666ec4e412475e5455b33bd');

                contentAuth.login('admin', 'admin').then(() => {
                    
                });
            });

            it('Ticket should be absent in the client and the resolve promise should be called', async () => {
                authEcmMock.get204ResponseLogout();

                contentAuth.logout().then(() => {
                    assert.equal(contentAuth.config.ticket, undefined);
                    
                });
            });

            it('Logout should be rejected if the Ticket is already expired', async () => {
                authEcmMock.get404ResponseLogout();
                contentAuth.logout().then(
                    () => {},
                    (error) => {
                        assert.equal(error.error.toString(), 'Error: Not Found');
                        
                    }
                );
            });
        });
    });
});
