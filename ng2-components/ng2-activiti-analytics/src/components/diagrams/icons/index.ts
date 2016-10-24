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

import { DiagramIconServiceTaskComponent } from './diagram-icon-service-task.component';
import { DiagramIconSendTaskComponent } from './diagram-icon-send-task.component';
import { DiagramIconUserTaskComponent } from './diagram-icon-user-task.component';
import { DiagramIconManualTaskComponent } from './diagram-icon-manual-task.component';
import { DiagramIconCamelTaskComponent } from './diagram-icon-camel-task.component';
import { DiagramIconMuleTaskComponent } from './diagram-icon-mule-task.component';
import { DiagramIconAlfrescoPublishTaskComponent } from './diagram-icon-alfresco-publish-task.component';
import { DiagramIconRestCallTaskComponent } from './diagram-icon-rest-call-task.component';
import { DiagramIconGoogleDrivePublishTaskComponent } from './diagram-icon-google-drive-publish-task.component';

// primitives
export * from './diagram-icon-service-task.component';
export * from './diagram-icon-send-task.component';
export * from './diagram-icon-user-task.component';
export * from './diagram-icon-manual-task.component';
export * from './diagram-icon-camel-task.component';
export * from './diagram-icon-mule-task.component';
export * from './diagram-icon-alfresco-publish-task.component';
export * from './diagram-icon-rest-call-task.component';
export * from './diagram-icon-google-drive-publish-task.component';

export const DIAGRAM_ICONS_DIRECTIVES: any[] = [
    DiagramIconServiceTaskComponent,
    DiagramIconSendTaskComponent,
    DiagramIconUserTaskComponent,
    DiagramIconManualTaskComponent,
    DiagramIconCamelTaskComponent,
    DiagramIconMuleTaskComponent,
    DiagramIconAlfrescoPublishTaskComponent,
    DiagramIconRestCallTaskComponent,
    DiagramIconGoogleDrivePublishTaskComponent
];
