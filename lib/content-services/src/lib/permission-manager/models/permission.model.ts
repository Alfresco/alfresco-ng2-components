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

import { PermissionElement } from '@alfresco/js-api';

export class PermissionDisplayModel implements PermissionElement {

    authorityId?: string;
    name?: string;
    accessStatus?: PermissionElement.AccessStatusEnum;
    isInherited: boolean = false;
    icon: string;
    readonly?: boolean;

    constructor(obj?: any) {
        if (obj) {
            this.authorityId = obj.authorityId;
            this.name = obj.name;
            this.accessStatus = obj.accessStatus;
            this.isInherited = obj.isInherited !== null && obj.isInherited !== undefined ? obj.isInherited : false;
            this.icon = obj.icon ? obj.icon : 'vpn_key';
        }
    }
}
