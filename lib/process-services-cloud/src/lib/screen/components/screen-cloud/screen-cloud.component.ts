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

import { CommonModule } from '@angular/common';
import { Component, ComponentRef, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ScreenRenderingService } from '../../../services/public-api';
import { MatCardModule } from '@angular/material/card';
import { UserTaskCustomUi } from '../../models/screen-cloud.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-cloud-task-screen',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    templateUrl: './screen-cloud.component.html'
})
export class TaskScreenCloudComponent implements OnInit {
    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** App name to fetch data for dynamic component. */
    @Input()
    appName: string = '';

    /** Boolean informing if a task can be claimed. */
    @Input()
    canClaimTask: boolean;

    /** Boolean informing if a task can be unclaimed. */
    @Input()
    canUnclaimTask: boolean;

    @Input()
    showCancelButton: boolean;

    /** Screen id to create dynamic component. */
    @Input()
    screenId: string = '';

    /** Process Instance Id to fetch corresponding data. */
    @Input()
    processInstanceId: string = '';

    /** Name of the task. */
    @Input()
    taskName: string = '';

    /** Toggle readonly state of the task. */
    @Input()
    readOnly = false;

    /** Emitted when the task is saved. */
    @Output()
    taskSaved = new EventEmitter();

    /** Emitted when the task is completed. */
    @Output()
    taskCompleted = new EventEmitter();

    /** Emitted when there is an error. */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when the task is cancelled. */
    @Output()
    cancelTask = new EventEmitter<any>();

    /** Emitted when the task is claimed. */
    @Output()
    claimTask = new EventEmitter<any>();

    /** Emitted when the task is unclaimed. */
    @Output()
    unclaimTask = new EventEmitter<any>();

    @ViewChild('container', { read: ViewContainerRef, static: true })
    container: ViewContainerRef;

    private destroyRef = inject(DestroyRef);
    componentRef: ComponentRef<UserTaskCustomUi>;
    private readonly screenRenderingService = inject(ScreenRenderingService);

    ngOnInit() {
        this.createDynamicComponent();
    }

    createDynamicComponent() {
        if (this.screenId) {
            const componentType = this.screenRenderingService.resolveComponentType({ type: this.screenId });
            this.componentRef = this.container.createComponent(componentType);
            this.setInputsForDynamicComponent();
            this.subscribeToOutputs();
        }
    }

    setInputsForDynamicComponent(): void {
        if (this.taskId && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'taskId')) {
            this.componentRef.setInput('taskId', this.taskId);
        }
        if (this.appName && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'appName')) {
            this.componentRef.setInput('appName', this.appName);
        }
        if (this.screenId && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'screenId')) {
            this.componentRef.setInput('screenId', this.screenId);
        }
        if (this.processInstanceId && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'processInstanceId')) {
            this.componentRef.setInput('processInstanceId', this.processInstanceId);
        }
        if (this.taskName && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'taskName')) {
            this.componentRef.setInput('taskName', this.taskName);
        }
        if (this.canClaimTask && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'canClaimTask')) {
            this.componentRef.setInput('canClaimTask', this.canClaimTask);
        }
        if (this.canUnclaimTask && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'canUnclaimTask')) {
            this.componentRef.setInput('canUnclaimTask', this.canUnclaimTask);
        }
        if (this.showCancelButton && Object.prototype.hasOwnProperty.call(this.componentRef.instance, 'showCancelButton')) {
            this.componentRef.setInput('showCancelButton', this.showCancelButton);
        }
    }

    subscribeToOutputs() {
        if (this.componentRef.instance?.taskSaved) {
            this.componentRef.instance.taskSaved.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.taskSaved.emit());
        }
        if (this.componentRef.instance?.taskCompleted) {
            this.componentRef.instance.taskCompleted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.taskCompleted.emit());
        }
        if (this.componentRef.instance?.error) {
            this.componentRef.instance.error.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.error.emit(data));
        }

        if (this.componentRef.instance?.claimTask) {
            this.componentRef.instance.claimTask.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.claimTask.emit(data));
        }
        if (this.componentRef.instance?.unclaimTask) {
            this.componentRef.instance.unclaimTask.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.unclaimTask.emit(data));
        }
        if (this.componentRef.instance?.cancelTask) {
            this.componentRef.instance.cancelTask.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.cancelTask.emit(data));
        }
    }

    switchToDisplayMode(newDisplayMode?: string) {
        if (this.componentRef?.instance?.switchToDisplayMode) {
            this.componentRef.instance.switchToDisplayMode(newDisplayMode);
        }
    }
}
