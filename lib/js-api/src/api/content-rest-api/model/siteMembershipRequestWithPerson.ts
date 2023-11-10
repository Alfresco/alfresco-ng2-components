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

import { DateAlfresco } from '../../content-custom-api';
import { Person } from './person';
import { Site } from './site';

export class SiteMembershipRequestWithPerson {
    id: string;
    createdAt: Date;
    site: Site;
    person: Person;
    message?: string;

    constructor(input?: Partial<SiteMembershipRequestWithPerson>) {
        if (input) {
            Object.assign(this, input);
            this.createdAt = input.createdAt ? DateAlfresco.parseDate(input.createdAt) : undefined;
            this.site = input.site ? new Site(input.site) : undefined;
            this.person = input.person ? new Person(input.person) : undefined;
        }
    }

}
