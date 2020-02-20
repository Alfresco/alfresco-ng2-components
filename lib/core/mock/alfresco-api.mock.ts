/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable:adf-file-name  */
export class AlfrescoApiMock {

    login() {
        return new Promise((resolve) => {
            resolve('TICKET_4479f4d3bb155195879bfbb8d5206f433488a1b1');
        });
    }

    logout() {
        return new Promise((resolve) => {
            resolve('logout');
        });
    }

    changeConfig() {
    }
}
