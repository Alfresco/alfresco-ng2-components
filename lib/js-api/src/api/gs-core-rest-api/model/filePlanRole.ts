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

import { FilePlanRoleCapability } from './filePlanRoleCapability';

export class FilePlanRole {
    displayLabel: string;
    groupShortName: string;
    name: string;
    roleGroupName: string;
    capabilities: FilePlanRoleCapability[];

    constructor(input?: Partial<FilePlanRole>) {
        if (input) {
            Object.assign(this, input);
            this.capabilities = input.capabilities?.map((capability) => new FilePlanRoleCapability(capability));
        }
    }
}
