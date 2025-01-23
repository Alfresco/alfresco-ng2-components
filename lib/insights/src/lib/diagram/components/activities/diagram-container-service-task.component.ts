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

/* eslint-disable @angular-eslint/component-selector */

import { Component } from '@angular/core';
import { DiagramElement } from '../diagram-element';
import { CommonModule } from '@angular/common';
import { DiagramSendTaskComponent } from './diagram-send-task.component';
import { DiagramCamelTaskComponent } from './diagram-camel-task.component';
import { DiagramMuleTaskComponent } from './diagram-mule-task.component';
import { DiagramAlfrescoPublishTaskComponent } from './diagram-alfresco-publish-task.component';
import { DiagramRestCallTaskComponent } from './diagram-rest-call-task.component';
import { DiagramGoogleDrivePublishTaskComponent } from './diagram-google-drive-publish-task.component';
import { DiagramBoxPublishTaskComponent } from './diagram-box-publish-task.component';
import { DiagramServiceTaskComponent } from './diagram-service-task.component';

@Component({
    selector: 'diagram-container-service-task',
    imports: [
        CommonModule,
        DiagramSendTaskComponent,
        DiagramCamelTaskComponent,
        DiagramMuleTaskComponent,
        DiagramAlfrescoPublishTaskComponent,
        DiagramRestCallTaskComponent,
        DiagramGoogleDrivePublishTaskComponent,
        DiagramBoxPublishTaskComponent,
        DiagramServiceTaskComponent
    ],
    templateUrl: './diagram-container-service-task.component.html'
})
export class DiagramContainerServiceTaskComponent extends DiagramElement {}
