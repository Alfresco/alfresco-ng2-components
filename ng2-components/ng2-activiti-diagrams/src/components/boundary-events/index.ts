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

 /* tslint:disable:component-selector  */

import { DiagramBoundaryEventComponent } from './diagram-boundary-event.component';
import { DiagramThrowEventComponent } from './diagram-throw-event.component';

// primitives
export * from './diagram-boundary-event.component';
export * from './diagram-throw-event.component';

export const DIAGRAM_BOUNDARY_EVENTS_DIRECTIVES: any[] = [
    DiagramBoundaryEventComponent,
    DiagramThrowEventComponent
];
