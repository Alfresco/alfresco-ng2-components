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

import { Directive, Input, HostListener, Output, EventEmitter, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { IdentityUserService } from '../../people/services/identity-user.service';
import { TaskCloudService } from '../services/task-cloud.service';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[adf-cloud-claim-task]'
})
export class ClaimTaskCloudDirective implements OnInit {

    /** (Required) The id of the task. */
    @Input()
    taskId: string;

    /** (Required) The name of the application. */
    @Input()
    appName: string = '';

    /** Emitted when the task is completed. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the task cannot be completed. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    invalidParams: string[] = [];

    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2,
        private taskListService: TaskCloudService,
        private identityUserService: IdentityUserService) { }

    ngOnInit() {
        this.validateInputs();
    }

    validateInputs() {

        if (!this.isTaskValid()) {
            this.invalidParams.push('taskId');
        }
        if (!this.isAppValid()) {
            this.invalidParams.push('appName');
        }
        if (this.invalidParams.length) {
            throw new Error(`Attribute ${this.invalidParams.join(', ')} is required`);
        }
    }

    isTaskValid(): boolean {
        return this.taskId && this.taskId.length > 0;
    }

    isAppValid(): boolean {
        return !!this.appName || this.appName === '';
    }

    @HostListener('click')
    async onClick() {
        try {
            await this.claimTask();
        } catch (error) {
            this.error.emit(error);
        }

    }

    private async claimTask() {
        const currentUser: string = this.identityUserService.getCurrentUserInfo().username;
        try {
            this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            const result = await this.taskListService.claimTask(this.appName, this.taskId, currentUser).toPromise();
            if (result) {
                this.success.emit(result);
            }
        } catch (error) {
            this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
            this.error.emit(error);
        }
    }
}
