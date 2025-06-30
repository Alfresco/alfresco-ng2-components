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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { UnClaimTaskCloudDirective } from './unclaim-task/unclaim-task-cloud.directive';
import { ClaimTaskCloudDirective } from './claim-task/claim-task-cloud.directive';

@Component({
    selector: 'adf-cloud-user-task-cloud-buttons',
    standalone: true,
    imports: [CommonModule, TranslatePipe, UnClaimTaskCloudDirective, ClaimTaskCloudDirective, MatButtonModule],
    styles: ['button { margin-right: 8px; }'],
    templateUrl: './user-task-cloud-buttons.component.html'
})
export class UserTaskCloudButtonsComponent {
    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string = '';

    /** Boolean informing if a task can be claimed. */
    @Input()
    canClaimTask: boolean;

    /** Boolean informing if a task can be unclaimed. */
    @Input()
    canUnclaimTask: boolean;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Toggle rendering of the `Cancel` button. */
    @Input()
    showCancelButton = true;

    /** Emitted when any error occurs. */
    @Output() error = new EventEmitter<any>();

    /** Emitted when the cancel button is clicked. */
    @Output() cancelClick = new EventEmitter<any>();

    /** Emitted when the task is claimed. */
    @Output() claimTask = new EventEmitter<any>();

    /** Emitted when the task is unclaimed. */
    @Output() unclaimTask = new EventEmitter<any>();

    onError(data: any): void {
        this.error.emit(data);
    }

    onUnclaimTask(): void {
        this.unclaimTask.emit();
    }

    onClaimTask(): void {
        this.claimTask.emit();
    }

    onCancelClick(): void {
        this.cancelClick.emit();
    }
}
