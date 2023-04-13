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

import { ProcessDefinitionRepresentation } from '../../process-list/models/process-definition.model';
import { ProcessInstance } from '../../process-list/models/process-instance.model';

export const newProcess = new ProcessInstance({
    id: '32323',
    name: 'Process'
});

export const testProcessDef = new ProcessDefinitionRepresentation({
    id: 'my:process1',
    name: 'My Process 1',
    hasStartForm: false
});

export const testProcessDefinitions = [new ProcessDefinitionRepresentation({
    id: 'my:process1',
    name: 'My Process 1',
    hasStartForm: false
})];

export const testMultipleProcessDefs = [new ProcessDefinitionRepresentation({
    id: 'my:process1',
    name: 'My Process 1',
    hasStartForm: false
}), new ProcessDefinitionRepresentation({
    id: 'my:process2',
    name: 'My Process 2',
    hasStartForm: true
})];

export const testProcessDefWithForm = [new ProcessDefinitionRepresentation({
    id: 'my:process1',
    name: 'My Process 1',
    hasStartForm: true
})];
