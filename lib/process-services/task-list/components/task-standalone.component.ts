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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { LogService, FormService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-task-standalone',
    templateUrl: './task-standalone.component.html',
    styleUrls: ['./task-standalone.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TaskStandaloneComponent implements OnInit {

    /** Details of the task. */
    @Input()
    taskDetails;

    /** If true then Task completed message is shown and `Complete` and `Cancel` buttons are hidden. */
    @Input()
    isCompleted: boolean = false;

    /** Toggles rendering of the `Complete` button. */
    @Input()
    hasCompletePermission: boolean = true;

    /** Toggles rendering of the `Cancel` button. */
    @Input()
    hideCancelButton: boolean = true;

    /** Emitted when the "Cancel" button is clicked. */
    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when the form associated with the task is completed. */
    @Output()
    complete: EventEmitter<void> = new EventEmitter<void>();

    showAttachForm: boolean = false;

    taskName: string;

    constructor(
        private formService: FormService,
        private logService: LogService
    ) { }

    ngOnInit() {
        this.taskName = this.taskDetails.name;
    }

    onCancelButtonClick(): void {
        this.cancel.emit();
    }

    onCompleteButtonClick(): void {
        this.complete.emit();
    }

    hasCompleteButton(): boolean {
        return this.hasCompletePermission && !this.isCompleted;
    }

    hasCancelButton(): boolean {
        return !this.hideCancelButton && !this.isCompleted;
    }

    hasAttachFormButton(): boolean {
        return !this.isCompleted;
    }

    onShowAttachForm() {
        this.showAttachForm = true;
    }

    onCancelAttachForm() {
        this.showAttachForm = false;
    }

    onCompleteAttachForm() {
        this.showAttachForm = false;

        this.formService.getTaskForm(this.taskDetails.id)
            .subscribe((res) => {
            }, error => this.logService.error('Could not load forms'));
    }
}
