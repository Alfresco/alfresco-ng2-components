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

import { DateAlfresco } from '../../content-custom-api/model/dateAlfresco';
import { GroupCapabilityRepresentation } from './groupCapabilityRepresentation';
import { UserRepresentationGroup } from './userRepresentationGroup';

export class GroupRepresentation {
    capabilities?: GroupCapabilityRepresentation[];
    externalId?: string;
    groups?: any[];
    id?: number;
    lastSyncTimeStamp?: Date;
    manager?: UserRepresentationGroup;
    name?: string;
    parentGroupId?: number;
    status?: string;
    tenantId?: number;
    type?: number;
    userCount?: number;
    users?: UserRepresentationGroup[];

    constructor(input?: Partial<GroupRepresentation>) {
        if (input) {
            Object.assign(this, input);
            if (input.capabilities) {
                this.capabilities = input.capabilities.map((item) => {
                    return new GroupCapabilityRepresentation(item);
                });
            }
            if (input.groups) {
                this.groups = input.groups.map((item) => {
                    return new GroupRepresentation(item);
                });
            }
            this.lastSyncTimeStamp = input.lastSyncTimeStamp ? DateAlfresco.parseDate(input.lastSyncTimeStamp) : undefined;
            this.manager = input.manager ? new UserRepresentationGroup(input.manager) : undefined;
            if (input.users) {
                this.users = input.users.map((item) => {
                    return new UserRepresentationGroup(item);
                });
            }
        }
    }

}
