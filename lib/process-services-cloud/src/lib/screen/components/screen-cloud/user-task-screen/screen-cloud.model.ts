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

import { EventEmitter } from '@angular/core';

export interface UserTaskCustomUi {
    appName: string;
    canClaimTask: boolean;
    canUnclaimTask: boolean;
    processInstanceId: string;
    rootProcessInstanceId: string;
    screenId: string;
    showCancelButton: boolean;
    taskName: string;
    taskId: string;
    isNextTaskCheckboxChecked: boolean;
    showNextTaskCheckbox: boolean;
    cancelTask: EventEmitter<any>;
    claimTask: EventEmitter<any>;
    error: EventEmitter<any>;
    switchToDisplayMode?: (newDisplayMode?: string) => void;
    taskCompleted: EventEmitter<any>;
    taskSaved: EventEmitter<string>;
    unclaimTask: EventEmitter<any>;
    nextTaskCheckboxCheckedChanged: EventEmitter<any>;
}
