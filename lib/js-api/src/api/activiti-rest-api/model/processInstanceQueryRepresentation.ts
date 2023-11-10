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

export class ProcessInstanceQueryRepresentation {
    appDefinitionId?: number;
    page?: number;
    processDefinitionId?: string;
    processInstanceId?: string;
    size?: number;
    sort?: ProcessInstanceQueryRepresentation.SortEnum | string;
    start?: number;
    state?: ProcessInstanceQueryRepresentation.StateEnum | string;

    constructor(input?: Partial<ProcessInstanceQueryRepresentation>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
export namespace ProcessInstanceQueryRepresentation {
    export type SortEnum = 'created-desc' | 'created-asc' | 'ended-desc' | 'ended-asc';
    export const SortEnum = {
        CreatedDesc: 'created-desc' as SortEnum,
        CreatedAsc: 'created-asc' as SortEnum,
        EndedDesc: 'ended-desc' as SortEnum,
        EndedAsc: 'ended-asc' as SortEnum
    };
    export type StateEnum = 'running' | 'completed' | 'all';
    export const StateEnum = {
        Running: 'running' as StateEnum,
        Completed: 'completed' as StateEnum,
        All: 'all' as StateEnum
    };
}
