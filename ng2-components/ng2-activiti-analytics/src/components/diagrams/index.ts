/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { DiagramComponent } from './diagram.component';
import { DiagramEventComponent } from './diagram-event.component';
import { DiagramTaskComponent } from './diagram-task.component';
import { DiagramSequenceFlowComponent } from './diagram-sequence-flow.component';
import { DiagramExclusiveGatwayComponent } from './diagram-exclusive-gateway.component';

import { DiagramColorService } from './services/diagram-color.service';

// primitives
export * from './diagram.component';
export * from './diagram-event.component';
export * from './diagram-task.component';
export * from './diagram-sequence-flow.component';
export * from './diagram-exclusive-gateway.component';

export const DIAGRAM_DIRECTIVES: any[] = [
    DiagramComponent,
    DiagramEventComponent,
    DiagramTaskComponent,
    DiagramSequenceFlowComponent,
    DiagramExclusiveGatwayComponent
];

export const DIAGRAM_PROVIDERS: any[] = [
    DiagramColorService
];
