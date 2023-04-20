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

import { DiagramElementPropertyModel } from './diagram-element-property.model';
import { DiagramEventDefinitionModel } from './diagram-event-definition.model';

export class DiagramElementModel {
    completed: boolean;
    current: boolean;
    height: string;
    id: string;
    name: string;
    type: string;
    width: string;
    value: string;
    x: string;
    y: string;
    properties: DiagramElementPropertyModel[] = [];
    dataType: string = '';
    eventDefinition: DiagramEventDefinitionModel;
    taskType: string = '';

    constructor(obj?: any) {
        if (obj) {
            this.completed = !!obj.completed;
            this.current = !!obj.current;
            this.height = obj.height || '';
            this.id = obj.id || '';
            this.name = obj.name || '';
            this.type = obj.type || '';
            this.width = obj.width || '';
            this.value = obj.value || '';
            this.x = obj.x || '';
            this.y = obj.y || '';
            this.taskType = obj.taskType || '';
            if (obj.properties) {
                obj.properties.forEach((property: DiagramElementPropertyModel) => {
                    this.properties.push(new DiagramElementPropertyModel(property));
                });
            }
            this.dataType = obj.dataType || '';
            if (obj.eventDefinition) {
                this.eventDefinition = new DiagramEventDefinitionModel(obj.eventDefinition);
            }
        }
    }
}
