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

import { Capabilities } from './capabilities';
import { Company } from './company';
import { DateAlfresco } from '../../content-custom-api';

export class Person {
    id: string;
    firstName: string;
    lastName?: string;
    displayName?: string;
    description?: string;
    avatarId?: string;
    email: string;
    skypeId?: string;
    googleId?: string;
    instantMessageId?: string;
    jobTitle?: string;
    location?: string;
    company?: Company;
    mobile?: string;
    telephone?: string;
    statusUpdatedAt?: Date;
    userStatus?: string;
    enabled: boolean;
    emailNotificationsEnabled?: boolean;
    aspectNames?: string[];
    properties?: { [key: string]: string };
    capabilities?: Capabilities;

    constructor(input?: Partial<Person>) {
        if (input) {
            Object.assign(this, input);
            this.statusUpdatedAt = input.statusUpdatedAt ? DateAlfresco.parseDate(input.statusUpdatedAt) : undefined;
        }
    }
}
