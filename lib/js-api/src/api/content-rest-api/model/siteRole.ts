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

import { Site } from './site';

export class SiteRole {
    site: Site;
    id: string;
    guid: string;
    role: SiteRole.RoleEnum | string;

    constructor(input?: Partial<SiteRole>) {
        if (input) {
            Object.assign(this, input);
            this.site = input.site ? new Site(input.site) : undefined;
        }
    }

}
export namespace SiteRole {
    export type RoleEnum = 'SiteConsumer' | 'SiteCollaborator' | 'SiteContributor' | 'SiteManager';
    export const RoleEnum = {
        SiteConsumer: 'SiteConsumer' as RoleEnum,
        SiteCollaborator: 'SiteCollaborator' as RoleEnum,
        SiteContributor: 'SiteContributor' as RoleEnum,
        SiteManager: 'SiteManager' as RoleEnum
    };
}
