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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class ModelJsonBpmMock extends BaseMock {
    get200EditorDisplayJsonClient(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/app/rest/models/1/model-json')
            .reply(200, {
                elements: [
                    {
                        id: 'startEvent1',
                        name: null,
                        x: 100,
                        y: 163,
                        width: 30,
                        height: 30,
                        type: 'StartEvent',
                        properties: []
                    },
                    {
                        id: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        name: null,
                        x: 175,
                        y: 138,
                        width: 100,
                        height: 80,
                        type: 'UserTask',
                        properties: [{ name: 'Assignee', value: '$INITIATOR' }]
                    },
                    {
                        id: 'sid-8F6A225D-91AC-4FE3-8DDF-7DF034A37C44',
                        name: null,
                        x: 320,
                        y: 164,
                        width: 28,
                        height: 28,
                        type: 'EndEvent',
                        properties: []
                    }
                ],
                flows: [
                    {
                        id: 'sid-BC321EAF-BF83-4343-91C4-C0E7C4E10133',
                        type: 'sequenceFlow',
                        sourceRef: 'startEvent1',
                        targetRef: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        waypoints: [
                            { x: 130, y: 178 },
                            { x: 175, y: 178 }
                        ],
                        properties: []
                    },
                    {
                        id: 'sid-CA38A1B7-1BFC-44C1-B20D-86748AE7AAA0',
                        type: 'sequenceFlow',
                        sourceRef: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        targetRef: 'sid-8F6A225D-91AC-4FE3-8DDF-7DF034A37C44',
                        waypoints: [
                            { x: 275, y: 178 },
                            { x: 320, y: 178 }
                        ],
                        properties: []
                    }
                ],
                diagramBeginX: 115,
                diagramBeginY: 138,
                diagramWidth: 348,
                diagramHeight: 218
            });
    }

    get200HistoricEditorDisplayJsonClient(): void {
        nock('https://127.0.0.1:9999', { encodedQueryParams: true })
            .get('/activiti-app/app/rest/models/1/history/1/model-json')
            .reply(200, {
                elements: [
                    {
                        id: 'startEvent1',
                        name: null,
                        x: 100,
                        y: 163,
                        width: 30,
                        height: 30,
                        type: 'StartEvent',
                        properties: []
                    },
                    {
                        id: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        name: null,
                        x: 175,
                        y: 138,
                        width: 100,
                        height: 80,
                        type: 'UserTask',
                        properties: [{ name: 'Assignee', value: '$INITIATOR' }]
                    },
                    {
                        id: 'sid-8F6A225D-91AC-4FE3-8DDF-7DF034A37C44',
                        name: null,
                        x: 320,
                        y: 164,
                        width: 28,
                        height: 28,
                        type: 'EndEvent',
                        properties: []
                    }
                ],
                flows: [
                    {
                        id: 'sid-BC321EAF-BF83-4343-91C4-C0E7C4E10133',
                        type: 'sequenceFlow',
                        sourceRef: 'startEvent1',
                        targetRef: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        waypoints: [
                            { x: 130, y: 178 },
                            { x: 175, y: 178 }
                        ],
                        properties: []
                    },
                    {
                        id: 'sid-CA38A1B7-1BFC-44C1-B20D-86748AE7AAA0',
                        type: 'sequenceFlow',
                        sourceRef: 'sid-8B04E151-6B46-4F48-B49E-F719057353AD',
                        targetRef: 'sid-8F6A225D-91AC-4FE3-8DDF-7DF034A37C44',
                        waypoints: [
                            { x: 275, y: 178 },
                            { x: 320, y: 178 }
                        ],
                        properties: []
                    }
                ],
                diagramBeginX: 115,
                diagramBeginY: 138,
                diagramWidth: 348,
                diagramHeight: 218
            });
    }
}
