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

import { AllowableOperationsEnum } from '../../common/models/allowable-operations.enum';

export class PermissionStyleModel {
    css: string;
    permission: AllowableOperationsEnum;
    isFolder: boolean = true;
    isFile: boolean = true;

    constructor(css: string, permission: AllowableOperationsEnum, isFile: boolean = true, isFolder: boolean = true) {
        this.css = css;
        this.permission = permission;
        this.isFile = isFile;
        this.isFolder = isFolder;
    }
}
