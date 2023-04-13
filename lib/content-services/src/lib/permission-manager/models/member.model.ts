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

import { Group, Node, NodeEntry, PermissionElement } from '@alfresco/js-api';
import { PermissionDisplayModel } from './permission.model';
import { RoleModel } from './role.model';
import { EcmUserModel } from '../../common/models/ecm-user.model';

export interface NodePermissionsModel {
    node: Node;
    roles: RoleModel[];
    inheritedPermissions: PermissionDisplayModel[];
    localPermissions: PermissionDisplayModel[];
}

export class MemberModel {
    id: string;
    role: string;
    accessStatus: PermissionElement.AccessStatusEnum | string;
    entry: {
        person?: EcmUserModel;
        group?: Group;
    };
    readonly: boolean = false;

    constructor(input?) {
        if (input) {
            Object.assign(this, input);
        }
    }

    static parseFromSearchResult({ entry }: NodeEntry): MemberModel {
        const result = new MemberModel();

        if (entry.nodeType === 'cm:person') {
            const person = new EcmUserModel({
                firstName: entry.properties['cm:firstName'],
                lastName: entry.properties['cm:lastName'],
                email: entry.properties['cm:email'],
                id: entry.properties['cm:userName']
            });

            result.id = person.id;
            result.entry = { person };
            result.accessStatus = 'ALLOWED';

            return result;
        }

        if (entry.nodeType === 'cm:authorityContainer') {
            const group = new Group({
                id: entry.properties['cm:authorityName'],
                displayName: entry.properties['cm:authorityDisplayName'] || entry.properties['cm:authorityName']
            });

            result.id = group.id;
            result.entry = { group };
            result.accessStatus = 'ALLOWED';

            return result;
        }
        return null;
    }

    toPermissionElement(): PermissionElement {
        return {
            authorityId: this.id,
            name: this.role,
            accessStatus: this.accessStatus
        };
    }
}
