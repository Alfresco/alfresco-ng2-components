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
import { AlfrescoApi, WebscriptApi } from '../../src';
import { EcmAuthMock, WebScriptMock } from '../mockObjects';

describe('WebScript', () => {
    const hostEcm = 'https://127.0.0.1:8080';
    const contextRoot = 'script';
    const servicePath = 'alfresco';
    const scriptPath = 'testWebScript';

    let authResponseMock: EcmAuthMock;
    let webScriptMock: WebScriptMock;
    let webscriptApi: WebscriptApi;

    beforeEach((done) => {
        authResponseMock = new EcmAuthMock(hostEcm);
        webScriptMock = new WebScriptMock(hostEcm, contextRoot, servicePath, scriptPath);
        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        webscriptApi = new WebscriptApi(alfrescoJsApi);
    });

    it('execute webScript return 400 error if is not present on the server should be handled by reject promise', (done) => {
        webScriptMock.get404Response();

        webscriptApi.executeWebScript('GET', scriptPath, null, contextRoot, servicePath).catch((error: any) => {
            assert.equal(error.status, 404);
            done();
        });
    });

    it('execute webScript GET return 200 if all is ok  should be handled by resolve promise', (done) => {
        webScriptMock.get200Response();

        webscriptApi.executeWebScript('GET', scriptPath, null, contextRoot, servicePath).then(() => {
            done();
        });
    });

    it('execute webScript that return HTML should not return it as Object', (done) => {
        webScriptMock.get200ResponseHTMLFormat();

        webscriptApi.executeWebScript('GET', 'sample/folder/Company%20Home').then((data) => {
            try {
                JSON.parse(data);
            } catch {
                done();
            }
        });
    });

    describe('Events', () => {
        it('WebScript should fire success event at the end', (done) => {
            webScriptMock.get200Response();

            const webscriptPromise: any = webscriptApi.executeWebScript('GET', scriptPath, null, contextRoot, servicePath);

            webscriptPromise.catch(() => {});
            webscriptPromise.on('success', () => {
                done();
            });
        });

        it('WebScript should fire error event if something go wrong', (done) => {
            webScriptMock.get404Response();

            const webscriptPromise: any = webscriptApi.executeWebScript('GET', scriptPath, null, contextRoot, servicePath);

            webscriptPromise.catch(() => {});
            webscriptPromise.on('error', () => {
                done();
            });
        });

        it('WebScript should fire unauthorized event if get 401', (done) => {
            webScriptMock.get401Response();

            const webscriptPromise: any = webscriptApi.executeWebScript('GET', scriptPath, null, contextRoot, servicePath);

            webscriptPromise.catch(() => {});
            webscriptPromise.on('unauthorized', () => {
                done();
            });
        });
    });
});
