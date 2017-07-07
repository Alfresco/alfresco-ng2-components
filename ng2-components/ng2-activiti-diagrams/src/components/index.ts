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

import { DIAGRAM_ACTIVITIES_DIRECTIVES } from './activities/index';
import { DIAGRAM_BOUNDARY_EVENTS_DIRECTIVES } from './boundary-events/index';
import { DiagramSequenceFlowComponent } from './diagram-sequence-flow.component';
import { DiagramComponent } from './diagram.component';
import { DIAGRAM_EVENTS_DIRECTIVES } from './events/index';
import { DIAGRAM_GATEWAY_DIRECTIVES } from './gateways/index';
import { DIAGRAM_ICONS_DIRECTIVES } from './icons/index';
import { DIAGRAM_INTERMEDIATE_EVENTS_DIRECTIVES } from './intermediate-catching-events/index';
import { DIAGRAM_STRUCTURAL_DIRECTIVES } from './structural/index';
import { DIAGRAM_SWIMLANES_DIRECTIVES } from './swimlanes/index';
import { DiagramTooltip } from './tooltip/index';

import { DiagramColorService } from '../services/diagram-color.service';
import { DiagramsService } from '../services/diagrams.service';

// primitives
export * from './diagram.component';
export * from './events/index';
export * from './activities/index';
export * from './icons/index';
export * from './diagram-sequence-flow.component';
export * from './boundary-events/index';
export * from './intermediate-catching-events/index';
export * from './structural/index';
export * from './swimlanes/index';

export const DIAGRAM_DIRECTIVES: any[] = [
    DiagramComponent,
    DIAGRAM_EVENTS_DIRECTIVES,
    DIAGRAM_ACTIVITIES_DIRECTIVES,
    DiagramSequenceFlowComponent,
    DIAGRAM_GATEWAY_DIRECTIVES,
    DIAGRAM_ICONS_DIRECTIVES,
    DIAGRAM_BOUNDARY_EVENTS_DIRECTIVES,
    DIAGRAM_INTERMEDIATE_EVENTS_DIRECTIVES,
    DIAGRAM_STRUCTURAL_DIRECTIVES,
    DIAGRAM_SWIMLANES_DIRECTIVES,
    DiagramTooltip
];

export const DIAGRAM_PROVIDERS: any[] = [
    DiagramsService,
    DiagramColorService
];
