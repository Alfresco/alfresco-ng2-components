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

import { DiagramAlfrescoPublishTaskComponent } from './activities/diagram-alfresco-publish-task.component';
import { DiagramBoxPublishTaskComponent } from './activities/diagram-box-publish-task.component';
import { DiagramBusinessRuleTaskComponent } from './activities/diagram-business-rule-task.component';
import { DiagramCamelTaskComponent } from './activities/diagram-camel-task.component';
import { DiagramContainerServiceTaskComponent } from './activities/diagram-container-service-task.component';
import { DiagramGoogleDrivePublishTaskComponent } from './activities/diagram-google-drive-publish-task.component';
import { DiagramManualTaskComponent } from './activities/diagram-manual-task.component';
import { DiagramMuleTaskComponent } from './activities/diagram-mule-task.component';
import { DiagramReceiveTaskComponent } from './activities/diagram-receive-task.component';
import { DiagramRestCallTaskComponent } from './activities/diagram-rest-call-task.component';
import { DiagramScriptTaskComponent } from './activities/diagram-script-task.component';
import { DiagramSendTaskComponent } from './activities/diagram-send-task.component';
import { DiagramServiceTaskComponent } from './activities/diagram-service-task.component';
import { DiagramTaskComponent } from './activities/diagram-task.component';
import { DiagramUserTaskComponent } from './activities/diagram-user-task.component';
import { DiagramBoundaryEventComponent } from './boundary-events/diagram-boundary-event.component';
import { DiagramThrowEventComponent } from './boundary-events/diagram-throw-event.component';
import { DiagramEndEventComponent } from './events/diagram-end-event.component';
import { DiagramEventComponent } from './events/diagram-event.component';
import { DiagramStartEventComponent } from './events/diagram-start-event.component';
import { DiagramEventGatewayComponent } from './gateways/diagram-event-gateway.component';
import { DiagramExclusiveGatewayComponent } from './gateways/diagram-exclusive-gateway.component';
import { DiagramGatewayComponent } from './gateways/diagram-gateway.component';
import { DiagramInclusiveGatewayComponent } from './gateways/diagram-inclusive-gateway.component';
import { DiagramParallelGatewayComponent } from './gateways/diagram-parallel-gateway.component';
import { DiagramContainerIconEventTaskComponent } from './icons/diagram-container-icon-event.component';
import { DiagramIconAlfrescoPublishTaskComponent } from './icons/diagram-icon-alfresco-publish-task.component';
import { DiagramIconBoxPublishTaskComponent } from './icons/diagram-icon-box-publish-task.component';
import { DiagramIconBusinessRuleTaskComponent } from './icons/diagram-icon-business-rule-task.component';
import { DiagramIconCamelTaskComponent } from './icons/diagram-icon-camel-task.component';
import { DiagramIconErrorComponent } from './icons/diagram-icon-error.component';
import { DiagramIconGoogleDrivePublishTaskComponent } from './icons/diagram-icon-google-drive-publish-task.component';
import { DiagramIconManualTaskComponent } from './icons/diagram-icon-manual-task.component';
import { DiagramIconMessageComponent } from './icons/diagram-icon-message.component';
import { DiagramIconMuleTaskComponent } from './icons/diagram-icon-mule-task.component';
import { DiagramIconReceiveTaskComponent } from './icons/diagram-icon-receive-task.component';
import { DiagramIconRestCallTaskComponent } from './icons/diagram-icon-rest-call-task.component';
import { DiagramIconScriptTaskComponent } from './icons/diagram-icon-script-task.component';
import { DiagramIconSendTaskComponent } from './icons/diagram-icon-send-task.component';
import { DiagramIconServiceTaskComponent } from './icons/diagram-icon-service-task.component';
import { DiagramIconSignalComponent } from './icons/diagram-icon-signal.component';
import { DiagramIconTimerComponent } from './icons/diagram-icon-timer.component';
import { DiagramIconUserTaskComponent } from './icons/diagram-icon-user-task.component';
import { DiagramIntermediateCatchingEventComponent } from './intermediate-catching-events/diagram-intermediate-catching-event.component';
import { DiagramEventSubprocessComponent } from './structural/diagram-event-subprocess.component';
import { DiagramSubprocessComponent } from './structural/diagram-subprocess.component';
import { DiagramLaneComponent } from './swimlanes/diagram-lane.component';
import { DiagramLanesComponent } from './swimlanes/diagram-lanes.component';
import { DiagramPoolComponent } from './swimlanes/diagram-pool.component';
import { DiagramPoolsComponent } from './swimlanes/diagram-pools.component';

export const DIAGRAM_COMPONENT_DIRECTIVES = [
    DiagramAlfrescoPublishTaskComponent,
    DiagramBoxPublishTaskComponent,
    DiagramBusinessRuleTaskComponent,
    DiagramCamelTaskComponent,
    DiagramContainerServiceTaskComponent,
    DiagramGoogleDrivePublishTaskComponent,
    DiagramManualTaskComponent,
    DiagramMuleTaskComponent,
    DiagramReceiveTaskComponent,
    DiagramRestCallTaskComponent,
    DiagramScriptTaskComponent,
    DiagramSendTaskComponent,
    DiagramServiceTaskComponent,
    DiagramTaskComponent,
    DiagramUserTaskComponent,
    DiagramBoundaryEventComponent,
    DiagramThrowEventComponent,
    DiagramEndEventComponent,
    DiagramEventComponent,
    DiagramStartEventComponent,
    DiagramEventGatewayComponent,
    DiagramExclusiveGatewayComponent,
    DiagramGatewayComponent,
    DiagramInclusiveGatewayComponent,
    DiagramParallelGatewayComponent,
    DiagramContainerIconEventTaskComponent,
    DiagramIconAlfrescoPublishTaskComponent,
    DiagramIconBoxPublishTaskComponent,
    DiagramIconBusinessRuleTaskComponent,
    DiagramIconCamelTaskComponent,
    DiagramIconErrorComponent,
    DiagramIconGoogleDrivePublishTaskComponent,
    DiagramIconManualTaskComponent,
    DiagramIconMessageComponent,
    DiagramIconMuleTaskComponent,
    DiagramIconReceiveTaskComponent,
    DiagramIconRestCallTaskComponent,
    DiagramIconScriptTaskComponent,
    DiagramIconSendTaskComponent,
    DiagramIconServiceTaskComponent,
    DiagramIconSignalComponent,
    DiagramIconTimerComponent,
    DiagramIconUserTaskComponent,
    DiagramIntermediateCatchingEventComponent,
    DiagramEventSubprocessComponent,
    DiagramSubprocessComponent,
    DiagramLaneComponent,
    DiagramLanesComponent,
    DiagramPoolComponent,
    DiagramPoolsComponent
] as const;
