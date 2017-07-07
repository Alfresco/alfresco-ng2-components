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

import { DiagramPoolComponent } from './diagram-pool.component';
import { DiagramPoolsComponent } from './diagram-pools.component';

import { DiagramLaneComponent } from './diagram-lane.component';
import { DiagramLanesComponent } from './diagram-lanes.component';

// primitives
export * from './diagram-pools.component';
export * from './diagram-pool.component';
export * from './diagram-lanes.component';
export * from './diagram-lane.component';

export const DIAGRAM_SWIMLANES_DIRECTIVES: any[] = [
    DiagramPoolsComponent,
    DiagramPoolComponent,
    DiagramLanesComponent,
    DiagramLaneComponent
];
