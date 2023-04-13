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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DiagramEndEventComponent } from './components/events/diagram-end-event.component';
import { DiagramEventComponent } from './components/events/diagram-event.component';
import { DiagramStartEventComponent } from './components/events/diagram-start-event.component';

import { DiagramAlfrescoPublishTaskComponent } from './components/activities/diagram-alfresco-publish-task.component';
import { DiagramBoxPublishTaskComponent } from './components/activities/diagram-box-publish-task.component';
import { DiagramBusinessRuleTaskComponent } from './components/activities/diagram-business-rule-task.component';
import { DiagramCamelTaskComponent } from './components/activities/diagram-camel-task.component';
import { DiagramContainerServiceTaskComponent } from './components/activities/diagram-container-service-task.component';
import { DiagramGoogleDrivePublishTaskComponent } from './components/activities/diagram-google-drive-publish-task.component';
import { DiagramManualTaskComponent } from './components/activities/diagram-manual-task.component';
import { DiagramMuleTaskComponent } from './components/activities/diagram-mule-task.component';
import { DiagramReceiveTaskComponent } from './components/activities/diagram-receive-task.component';
import { DiagramRestCallTaskComponent } from './components/activities/diagram-rest-call-task.component';
import { DiagramScriptTaskComponent } from './components/activities/diagram-script-task.component';
import { DiagramSendTaskComponent } from './components/activities/diagram-send-task.component';
import { DiagramServiceTaskComponent } from './components/activities/diagram-service-task.component';
import { DiagramTaskComponent } from './components/activities/diagram-task.component';
import { DiagramUserTaskComponent } from './components/activities/diagram-user-task.component';

import { DiagramBoundaryEventComponent } from './components/boundary-events/diagram-boundary-event.component';
import { DiagramThrowEventComponent } from './components/boundary-events/diagram-throw-event.component';

import { DiagramIntermediateCatchingEventComponent } from './components/intermediate-catching-events/diagram-intermediate-catching-event.component';

import { DiagramEventGatewayComponent } from './components/gateways/diagram-event-gateway.component';
import { DiagramExclusiveGatewayComponent } from './components/gateways/diagram-exclusive-gateway.component';
import { DiagramGatewayComponent } from './components/gateways/diagram-gateway.component';
import { DiagramInclusiveGatewayComponent } from './components/gateways/diagram-inclusive-gateway.component';
import { DiagramParallelGatewayComponent } from './components/gateways/diagram-parallel-gateway.component';

import { DiagramSequenceFlowComponent } from './components/diagram-sequence-flow.component';
import { DiagramComponent } from './components/diagram.component';

import { DiagramContainerIconEventTaskComponent } from './components/icons/diagram-container-icon-event.component';
import { DiagramIconAlfrescoPublishTaskComponent } from './components/icons/diagram-icon-alfresco-publish-task.component';
import { DiagramIconBoxPublishTaskComponent } from './components/icons/diagram-icon-box-publish-task.component';
import { DiagramIconBusinessRuleTaskComponent } from './components/icons/diagram-icon-business-rule-task.component';
import { DiagramIconCamelTaskComponent } from './components/icons/diagram-icon-camel-task.component';
import { DiagramIconErrorComponent } from './components/icons/diagram-icon-error.component';
import { DiagramIconGoogleDrivePublishTaskComponent } from './components/icons/diagram-icon-google-drive-publish-task.component';
import { DiagramIconManualTaskComponent } from './components/icons/diagram-icon-manual-task.component';
import { DiagramIconMessageComponent } from './components/icons/diagram-icon-message.component';
import { DiagramIconMuleTaskComponent } from './components/icons/diagram-icon-mule-task.component';
import { DiagramIconReceiveTaskComponent } from './components/icons/diagram-icon-receive-task.component';
import { DiagramIconRestCallTaskComponent } from './components/icons/diagram-icon-rest-call-task.component';
import { DiagramIconScriptTaskComponent } from './components/icons/diagram-icon-script-task.component';
import { DiagramIconSendTaskComponent } from './components/icons/diagram-icon-send-task.component';
import { DiagramIconServiceTaskComponent } from './components/icons/diagram-icon-service-task.component';
import { DiagramIconSignalComponent } from './components/icons/diagram-icon-signal.component';
import { DiagramIconTimerComponent } from './components/icons/diagram-icon-timer.component';
import { DiagramIconUserTaskComponent } from './components/icons/diagram-icon-user-task.component';

import { DiagramEventSubprocessComponent } from './components/structural/diagram-event-subprocess.component';
import { DiagramSubprocessComponent } from './components/structural/diagram-subprocess.component';

import { DiagramPoolComponent } from './components/swimlanes/diagram-pool.component';
import { DiagramPoolsComponent } from './components/swimlanes/diagram-pools.component';

import { DiagramLaneComponent } from './components/swimlanes/diagram-lane.component';
import { DiagramLanesComponent } from './components/swimlanes/diagram-lanes.component';

import { DiagramTooltipComponent } from './components/tooltip/diagram-tooltip.component';

import { RaphaelCircleDirective } from './components/raphael/raphael-circle.component';
import { RaphaelCrossDirective } from './components/raphael/raphael-cross.component';
import { RaphaelFlowArrowDirective } from './components/raphael/raphael-flow-arrow.component';
import { RaphaelMultilineTextDirective } from './components/raphael/raphael-multiline-text.component';
import { RaphaelPentagonDirective } from './components/raphael/raphael-pentagon.component';
import { RaphaelPlusDirective } from './components/raphael/raphael-plus.component';
import { RaphaelRectDirective } from './components/raphael/raphael-rect.component';
import { RaphaelRhombusDirective } from './components/raphael/raphael-rhombus.component';
import { RaphaelTextDirective } from './components/raphael/raphael-text.component';

import { RaphaelIconAlfrescoPublishDirective } from './components/raphael/icons/raphael-icon-alfresco-publish.component';
import { RaphaelIconBoxPublishDirective } from './components/raphael/icons/raphael-icon-box-publish.component';
import { RaphaelIconBusinessRuleDirective } from './components/raphael/icons/raphael-icon-business-rule.component';
import { RaphaelIconCamelDirective } from './components/raphael/icons/raphael-icon-camel.component';
import { RaphaelIconErrorDirective } from './components/raphael/icons/raphael-icon-error.component';
import { RaphaelIconGoogleDrivePublishDirective } from './components/raphael/icons/raphael-icon-google-drive-publish.component';
import { RaphaelIconManualDirective } from './components/raphael/icons/raphael-icon-manual.component';
import { RaphaelIconMessageDirective } from './components/raphael/icons/raphael-icon-message.component';
import { RaphaelIconMuleDirective } from './components/raphael/icons/raphael-icon-mule.component';
import { RaphaelIconReceiveDirective } from './components/raphael/icons/raphael-icon-receive.component';
import { RaphaelIconRestCallDirective } from './components/raphael/icons/raphael-icon-rest-call.component';
import { RaphaelIconScriptDirective } from './components/raphael/icons/raphael-icon-script.component';
import { RaphaelIconSendDirective } from './components/raphael/icons/raphael-icon-send.component';
import { RaphaelIconServiceDirective } from './components/raphael/icons/raphael-icon-service.component';
import { RaphaelIconSignalDirective } from './components/raphael/icons/raphael-icon-signal.component';
import { RaphaelIconTimerDirective } from './components/raphael/icons/raphael-icon-timer.component';
import { RaphaelIconUserDirective } from './components/raphael/icons/raphael-icon-user.component';
import { CoreModule } from '@alfresco/adf-core';

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [
        DiagramComponent,
        DiagramEventComponent,
        DiagramStartEventComponent,
        DiagramEndEventComponent,
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
        DiagramBusinessRuleTaskComponent,
        DiagramSequenceFlowComponent,
        DiagramGatewayComponent,
        DiagramExclusiveGatewayComponent,
        DiagramInclusiveGatewayComponent,
        DiagramParallelGatewayComponent,
        DiagramEventGatewayComponent,
        DiagramIconServiceTaskComponent,
        DiagramIconSendTaskComponent,
        DiagramIconUserTaskComponent,
        DiagramIconManualTaskComponent,
        DiagramIconCamelTaskComponent,
        DiagramIconMuleTaskComponent,
        DiagramIconAlfrescoPublishTaskComponent,
        DiagramIconRestCallTaskComponent,
        DiagramIconGoogleDrivePublishTaskComponent,
        DiagramIconBoxPublishTaskComponent,
        DiagramIconReceiveTaskComponent,
        DiagramIconScriptTaskComponent,
        DiagramIconBusinessRuleTaskComponent,
        DiagramContainerIconEventTaskComponent,
        DiagramIconTimerComponent,
        DiagramIconErrorComponent,
        DiagramIconSignalComponent,
        DiagramIconMessageComponent,
        DiagramBoundaryEventComponent,
        DiagramThrowEventComponent,
        DiagramIntermediateCatchingEventComponent,
        DiagramSubprocessComponent,
        DiagramEventSubprocessComponent,
        DiagramPoolsComponent,
        DiagramPoolComponent,
        DiagramLanesComponent,
        DiagramLaneComponent,
        DiagramTooltipComponent,
        RaphaelCircleDirective,
        RaphaelRectDirective,
        RaphaelTextDirective,
        RaphaelMultilineTextDirective,
        RaphaelFlowArrowDirective,
        RaphaelCrossDirective,
        RaphaelPlusDirective,
        RaphaelRhombusDirective,
        RaphaelPentagonDirective,
        RaphaelIconServiceDirective,
        RaphaelIconSendDirective,
        RaphaelIconUserDirective,
        RaphaelIconManualDirective,
        RaphaelIconCamelDirective,
        RaphaelIconMuleDirective,
        RaphaelIconAlfrescoPublishDirective,
        RaphaelIconRestCallDirective,
        RaphaelIconGoogleDrivePublishDirective,
        RaphaelIconBoxPublishDirective,
        RaphaelIconReceiveDirective,
        RaphaelIconScriptDirective,
        RaphaelIconBusinessRuleDirective,
        RaphaelIconTimerDirective,
        RaphaelIconErrorDirective,
        RaphaelIconSignalDirective,
        RaphaelIconMessageDirective
    ],
    exports: [
        DiagramComponent,
        DiagramEventComponent,
        DiagramStartEventComponent,
        DiagramEndEventComponent,
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
        DiagramBusinessRuleTaskComponent,
        DiagramSequenceFlowComponent,
        DiagramGatewayComponent,
        DiagramExclusiveGatewayComponent,
        DiagramInclusiveGatewayComponent,
        DiagramParallelGatewayComponent,
        DiagramEventGatewayComponent,
        DiagramIconServiceTaskComponent,
        DiagramIconSendTaskComponent,
        DiagramIconUserTaskComponent,
        DiagramIconManualTaskComponent,
        DiagramIconCamelTaskComponent,
        DiagramIconMuleTaskComponent,
        DiagramIconAlfrescoPublishTaskComponent,
        DiagramIconRestCallTaskComponent,
        DiagramIconGoogleDrivePublishTaskComponent,
        DiagramIconBoxPublishTaskComponent,
        DiagramIconReceiveTaskComponent,
        DiagramIconScriptTaskComponent,
        DiagramIconBusinessRuleTaskComponent,
        DiagramContainerIconEventTaskComponent,
        DiagramIconTimerComponent,
        DiagramIconErrorComponent,
        DiagramIconSignalComponent,
        DiagramIconMessageComponent,
        DiagramBoundaryEventComponent,
        DiagramThrowEventComponent,
        DiagramIntermediateCatchingEventComponent,
        DiagramSubprocessComponent,
        DiagramEventSubprocessComponent,
        DiagramPoolsComponent,
        DiagramPoolComponent,
        DiagramLanesComponent,
        DiagramLaneComponent,
        DiagramTooltipComponent,
        RaphaelCircleDirective,
        RaphaelRectDirective,
        RaphaelTextDirective,
        RaphaelMultilineTextDirective,
        RaphaelFlowArrowDirective,
        RaphaelCrossDirective,
        RaphaelPlusDirective,
        RaphaelRhombusDirective,
        RaphaelPentagonDirective,
        RaphaelIconServiceDirective,
        RaphaelIconSendDirective,
        RaphaelIconUserDirective,
        RaphaelIconManualDirective,
        RaphaelIconCamelDirective,
        RaphaelIconMuleDirective,
        RaphaelIconAlfrescoPublishDirective,
        RaphaelIconRestCallDirective,
        RaphaelIconGoogleDrivePublishDirective,
        RaphaelIconBoxPublishDirective,
        RaphaelIconReceiveDirective,
        RaphaelIconScriptDirective,
        RaphaelIconBusinessRuleDirective,
        RaphaelIconTimerDirective,
        RaphaelIconErrorDirective,
        RaphaelIconSignalDirective,
        RaphaelIconMessageDirective
    ]
})
export class DiagramsModule {}
