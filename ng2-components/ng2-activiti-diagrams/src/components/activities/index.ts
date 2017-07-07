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

import { DiagramAlfrescoPublishTaskComponent } from './diagram-alfresco-publish-task.component';
import { DiagramBoxPublishTaskComponent } from './diagram-box-publish-task.component';
import { DiagramBusinessRuleTaskComponent } from './diagram-business-rule-task.component';
import { DiagramCamelTaskComponent } from './diagram-camel-task.component';
import { DiagramContainerServiceTaskComponent } from './diagram-container-service-task.component';
import { DiagramGoogleDrivePublishTaskComponent } from './diagram-google-drive-publish-task.component';
import { DiagramManualTaskComponent } from './diagram-manual-task.component';
import { DiagramMuleTaskComponent } from './diagram-mule-task.component';
import { DiagramReceiveTaskComponent } from './diagram-receive-task.component';
import { DiagramRestCallTaskComponent } from './diagram-rest-call-task.component';
import { DiagramScriptTaskComponent } from './diagram-script-task.component';
import { DiagramSendTaskComponent } from './diagram-send-task.component';
import { DiagramServiceTaskComponent } from './diagram-service-task.component';
import { DiagramTaskComponent } from './diagram-task.component';
import { DiagramUserTaskComponent } from './diagram-user-task.component';

// primitives
export * from './diagram-container-service-task.component';
export * from './diagram-task.component';
export * from './diagram-service-task.component';
export * from './diagram-send-task.component';
export * from './diagram-user-task.component';
export * from './diagram-manual-task.component';
export * from './diagram-camel-task.component';
export * from './diagram-mule-task.component';
export * from './diagram-alfresco-publish-task.component';
export * from './diagram-rest-call-task.component';
export * from './diagram-google-drive-publish-task.component';
export * from './diagram-box-publish-task.component';
export * from './diagram-receive-task.component';
export * from './diagram-script-task.component';
export * from './diagram-business-rule-task.component';

export const DIAGRAM_ACTIVITIES_DIRECTIVES: any[] = [
    DiagramContainerServiceTaskComponent,
    DiagramTaskComponent,
    DiagramServiceTaskComponent,
    DiagramSendTaskComponent,
    DiagramUserTaskComponent,
    DiagramManualTaskComponent,
    DiagramCamelTaskComponent,
    DiagramMuleTaskComponent,
    DiagramAlfrescoPublishTaskComponent,
    DiagramRestCallTaskComponent,
    DiagramGoogleDrivePublishTaskComponent,
    DiagramBoxPublishTaskComponent,
    DiagramReceiveTaskComponent,
    DiagramScriptTaskComponent,
    DiagramBusinessRuleTaskComponent
];
