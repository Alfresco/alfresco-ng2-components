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

export class Site {
    id: string;
    guid: string;
    title: string;
    description?: string;
    visibility: Site.VisibilityEnum | string;
    preset?: string;
    role?: Site.RoleEnum | string;

    constructor(input?: Partial<Site>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
export namespace Site {
    export type VisibilityEnum = 'PRIVATE' | 'MODERATED' | 'PUBLIC';
    export const VisibilityEnum = {
        PRIVATE: 'PRIVATE' as VisibilityEnum,
        MODERATED: 'MODERATED' as VisibilityEnum,
        PUBLIC: 'PUBLIC' as VisibilityEnum
    };
    export type RoleEnum = 'SiteConsumer' | 'SiteCollaborator' | 'SiteContributor' | 'SiteManager';
    export const RoleEnum = {
        SiteConsumer: 'SiteConsumer' as RoleEnum,
        SiteCollaborator: 'SiteCollaborator' as RoleEnum,
        SiteContributor: 'SiteContributor' as RoleEnum,
        SiteManager: 'SiteManager' as RoleEnum
    };
}
