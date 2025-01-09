/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Component, ComponentRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ScreenRenderingService } from '../../../services/public-api';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'adf-cloud-task-screen',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    templateUrl: './screen-cloud.component.html'
})
export class TaskScreenCloudComponent implements OnInit {
    /** Task id to fetch corresponding form and values. */
    @Input() taskId: string;
    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string = '';
    /** Screen id to fetch corresponding screen widget. */
    @Input()
    screenId: string = '';
    /** Toggle readonly state of the task. */
    @Input()
    readOnly = false;

    @ViewChild('container', { read: ViewContainerRef, static: true })
    container: ViewContainerRef;
    componentRef: ComponentRef<any>;

    private readonly screenRenderingService = inject(ScreenRenderingService);

    ngOnInit() {
        if (this.screenId) {
            const componentType = this.screenRenderingService.resolveComponentType({ type: this.screenId });
            this.componentRef = this.container.createComponent(componentType);
            if (this.taskId) {
                this.componentRef.setInput('taskId', this.taskId);
            }
            if (this.appName) {
                this.componentRef.setInput('appName', this.appName);
            }
            if (this.screenId) {
                this.componentRef.setInput('screenId', this.screenId);
            }
        }
    }
}
