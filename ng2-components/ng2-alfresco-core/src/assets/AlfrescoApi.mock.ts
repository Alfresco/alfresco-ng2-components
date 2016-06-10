/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

export class AlfrescoApiMock {

    static getClientWithTicket(basePath: string, ticket: string) {
        return {};
    }

}
export module AlfrescoApiMock {

    export module Auth {

        export class AuthenticationApi {

            constructor(alfrescoClient: any) {
            }

            createTicket(loginRequest: any) {
                if (loginRequest.userId === 'fake-username' && loginRequest.password === 'fake-password') {
                    return new Promise(function (resolve, reject) {
                        resolve({
                            userId: 'fake-username',
                            ticket: 'TICKET_blah'
                        });
                    });
                } else {
                    new Promise(function (resolve, reject) {
                        reject();
                    });
                }
            }

            deleteTicket(loginRequest: any) {
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }

        }

        export class LoginRequest {
        }
    }
}


