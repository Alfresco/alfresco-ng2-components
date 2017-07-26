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

import { Pagination } from 'alfresco-js-api';

export class SiteModel {
    role: string;
    visibility: string;
    guid: string;
    description: string;
    id: string;
    preset: string;
    title: string;
    contents: SiteContentsModel[] = [];
    members: SiteMembersModel[] = [];
    pagination: Pagination;

    constructor(obj?: any) {
        if (obj && obj.entry) {
            this.role = obj.entry.role || null;
            this.visibility = obj.entry.visibility || null;
            this.guid = obj.entry.guid || null;
            this.description = obj.entry.description || null;
            this.id = obj.entry.id || null;
            this.preset = obj.entry.preset;
            this.title = obj.entry.title;
            this.pagination = obj.pagination || null;

            if (obj.relations && obj.relations.containers) {
                obj.relations.containers.list.entries.forEach((content) => {
                    this.contents.push(new SiteContentsModel(content.entry));
                });
            }

            if (obj.relations && obj.relations.members) {
                obj.relations.members.list.entries.forEach((member) => {
                    this.members.push(new SiteMembersModel(member.entry));
                });
            }
        }
    }

}

export class SiteContentsModel {
    id: string;
    folderId: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.folderId = obj.folderId || null;
        }
    }
}

export class SiteMembersModel {
    role: string;
    firstName: string;
    emailNotificationsEnabled: boolean = false;
    company: any;
    id: string;
    enable: boolean = false;
    email: string;

    constructor(obj?: any) {
        if (obj) {
            this.role = obj.role;
            this.firstName = obj.firstName || null;
            this.emailNotificationsEnabled = obj.emailNotificationsEnabled;
            this.company = obj.company || null;
            this.id = obj.id || null;
            this.enable = obj.enable;
            this.email = obj.email;
        }
    }
}
