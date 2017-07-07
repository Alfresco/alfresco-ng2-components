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

import { DiagramEndEventComponent } from './diagram-end-event.component';
import { DiagramEventComponent } from './diagram-event.component';
import { DiagramStartEventComponent } from './diagram-start-event.component';

// primitives
export * from './diagram-event.component';
export * from './diagram-start-event.component';
export * from './diagram-end-event.component';

export const DIAGRAM_EVENTS_DIRECTIVES: any[] = [
    DiagramEventComponent,
    DiagramStartEventComponent,
    DiagramEndEventComponent
];
