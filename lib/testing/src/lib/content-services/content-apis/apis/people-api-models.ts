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

export interface PersonModel {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    enabled?: boolean;
    properties?: any;
}

export class Person {
    id: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
    properties: any;

    constructor(user: PersonModel) {
        this.id = user.username;
        this.password = user.password || user.username;
        this.firstName = user.firstName || user.username;
        this.lastName = user.lastName || user.username;
        this.email = user.email || `${user.username}@alfresco.com`;
        this.enabled = user.enabled || true;
    }
}
