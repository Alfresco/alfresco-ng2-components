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

import {
    Directive,
    Input,
    Output,
    EventEmitter,
    HostListener,
    OnInit
} from '@angular/core';
import { TaskListService } from '../../services/tasklist.service';
import { LogService } from '@alfresco/adf-core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[adf-claim-task]'
})
export class ClaimTaskDirective implements OnInit {
    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** Emitted when the task is claimed. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when the task cannot be claimed. */
    @Output()
    error = new EventEmitter<any>();

    invalidParams: string[] = [];

    constructor(
        private taskListService: TaskListService,
        private logService: LogService) {}

    @HostListener('click')
    onClick() {
        try {
            this.claimTask();
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
            throw new Error(
                `Attribute ${this.invalidParams.join(', ')} is required`
            );
        }
    }

    isTaskValid(): boolean {
        return this.taskId && this.taskId.length > 0;
    }

    private claimTask() {
        this.taskListService.claimTask(this.taskId).subscribe(
            () => {
                this.logService.info('Task claimed');
                this.success.emit(this.taskId);
            },
            error => this.error.emit(error)
        );
    }
}
