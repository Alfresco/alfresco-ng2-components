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

import { Directive, HostListener, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskListService } from '../../services/tasklist.service';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[adf-unclaim-task]'
})
export class UnclaimTaskDirective implements OnInit {
    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** Emitted when the task is released. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when the task cannot be released. */
    @Output()
    error = new EventEmitter<any>();

    invalidParams: string[] = [];

    constructor(private taskListService: TaskListService) {}

    @HostListener('click')
    onClick() {
        try {
            this.unclaimTask();
        } catch (error) {
            this.error.emit(error);
        }
    }

    ngOnInit() {
        this.validateInputs();
    }

    validateInputs() {
        if (!this.isTaskValid()) {
            this.invalidParams.push('taskId');
        }
        if (this.invalidParams.length) {
            throw new Error(`Attribute ${this.invalidParams.join(', ')} is required`);
        }
    }

    isTaskValid(): boolean {
        return this.taskId && this.taskId.length > 0;
    }

    private unclaimTask() {
        this.taskListService.unclaimTask(this.taskId).subscribe(
            () => {
                this.success.emit(this.taskId);
            },
            (error) => this.error.emit(error)
        );
    }
}
