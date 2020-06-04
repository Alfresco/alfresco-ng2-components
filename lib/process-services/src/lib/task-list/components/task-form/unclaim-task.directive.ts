/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import {
    Directive,
    HostListener,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { TaskListService } from '../../services/tasklist.service';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[adf-unclaim-task]'
})
export class UnclaimTaskDirective {
    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** Emitted when the task is released. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task cannot be released. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    invalidParams: string[] = [];

    constructor(private taskListService: TaskListService) {}

    ngOnInit() {
        this.validateInputs();
    }

    validateInputs() {
        if (!this.isTaskValid()) {
            this.invalidParams.push('taskId');
        }
        if (this.invalidParams.length) {
            throw new Error(
                `Attribute ${this.invalidParams.join(', ')} is required`
            );
        }
    }

    isTaskValid(): boolean {
        return this.taskId && this.taskId.length > 0;
    }

    @HostListener('click')
    async onClick() {
        try {
            this.unclaimTask();
        } catch (error) {
            this.error.emit(error);
        }
    }

    private async unclaimTask() {
        await this.taskListService.unclaimTask(this.taskId).subscribe(
            () => {
                this.success.emit(this.taskId);
            },
            error => this.error.emit(error)
        );
    }
}
