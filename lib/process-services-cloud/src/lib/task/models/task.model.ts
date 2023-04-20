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

// eslint-disable-next-line no-shadow
export enum ClaimTaskEnum {
    claim = 'claim',
    unclaim = 'unclaim'
}
export interface TaskPriorityOption {
    label: string;
    key: string;
    value: string;
}

export const DEFAULT_TASK_PRIORITIES: TaskPriorityOption[] = [
    { label: 'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NONE', value: '0', key: '0' },
    { label: 'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.LOW', value: '1', key: '1' },
    { label: 'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.NORMAL', value: '2', key: '2' },
    { label: 'ADF_CLOUD_TASK_LIST.PROPERTIES.PRIORITY_VALUES.HIGH', value: '3', key: '3' }
];
