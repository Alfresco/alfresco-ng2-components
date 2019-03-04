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
import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TaskCloudService } from '../services/task-cloud.service';

@Directive({
    selector: '[adf-complete-task]'
})
export class CompleteTaskDirective {

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** (Required) The name of the application. */
    @Input()
    appName: string;

    /** Emitted when the task is completed. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task cannot be completed. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private taskListService: TaskCloudService) {}

    @HostListener('click')
    async onClick() {
        try {
            const result = await this.taskListService.completeTask(this.appName, this.taskId);
            if (result) {
                this.success.emit(result)
            }
        } catch (error) {
            this.error.emit(error);
        }

    }
}
