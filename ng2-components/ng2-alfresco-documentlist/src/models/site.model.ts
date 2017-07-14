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

    constructor(obj?: any) {
        this.role = obj && obj.entry && obj.entry.role;
        this.visibility = obj && obj.entry && obj.entry.visibility || null;
        this.guid = obj && obj.entry && obj.entry.guid || null;
        this.description = obj && obj.entry && obj.entry.description || null;
        this.id = obj && obj.entry && obj.entry.id || null;
        this.preset = obj && obj.entry && obj.entry.preset;
        this.title = obj && obj.entry && obj.entry.title;

        if (obj && obj.relations && obj.relations.containers) {
            obj.relations.containers.list.entries.forEach((content) => {
                this.contents.push(new SiteContentsModel(content.entry));
            });
        }

        if (obj && obj.relations && obj.relations.members) {
            obj.relations.members.list.entries.forEach((member) => {
                this.members.push(new SiteMembersModel(member.entry));
            });
        }
    }

}

export class SiteContentsModel {
    id: string;
    folderId: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.folderId = obj && obj.folderId || null;
    }

}

export class SiteMembersModel {
    role: string;
    firstName: string;
    emailNotificationsEnabled: boolean;
    company: any;
    id: string;
    enable: boolean;
    email: string;

    constructor(obj?: any) {
        this.role = obj && obj.role;
        this.firstName = obj && obj.firstName || null;
        this.emailNotificationsEnabled = obj && obj.emailNotificationsEnabled || false;
        this.company = obj && obj.company || null;
        this.id = obj && obj.id || null;
        this.enable = obj && obj.enable || false;
        this.email = obj && obj.email;
    }
}
