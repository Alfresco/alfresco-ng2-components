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

import { TestElement } from '@alfresco/adf-testing';

export class LockFilePage {

    cancelButton = TestElement.byCss('button[data-automation-id="lock-dialog-btn-cancel"]');
    saveButton = TestElement.byText('button span', 'Save');
    lockFileCheckboxText = TestElement.byText('mat-checkbox label span', ' Lock file ');
    lockFileCheckbox = TestElement.byCss('mat-checkbox[data-automation-id="adf-lock-node-checkbox"]');
    allowOwnerCheckbox = TestElement.byText('mat-checkbox[class*="adf-lock-file-name"] span', ' Allow the owner to modify this file ');
}
