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
import { Directive, Input, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { IdentityUserService } from '@alfresco/adf-core';
import { ProcessCloudService } from '../services/process-cloud.service';

@Directive({
    selector: '[adf-cloud-delete-process]'
})
export class DeleteProcessDirective implements OnInit {

    /** (Required) The id of the process. */
    @Input()
    processId: string;

    /** (Required) The name of the application. */
    @Input()
    appName: string;

    /** (Required) The process initiator */
    @Input()
    processInitiator: string;

    /** Emitted when the process is deleted. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the process cannot be deleted. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    invalidParams: string[] = [];

    constructor(
        private processCloudService: ProcessCloudService,
        private identityUserService: IdentityUserService) {}

    ngOnInit() {
        this.validateInputs();
    }

    validateInputs() {

        if (!this.isProcessValid()) {
            this.invalidParams.push('processId');
        }
        if (!this.isAppValid()) {
            this.invalidParams.push('appName');
        }
        if (!this.isProcessInitiatorValid()) {
            this.invalidParams.push('processInitiator');
        }
        if (this.invalidParams.length) {
            throw new Error(`Attribute ${this.invalidParams.join(', ')} is required`);
        }
    }

    isProcessValid(): boolean {
        return this.processId && this.processId.length > 0;
    }

    isAppValid(): boolean {
        return (this.appName && this.appName.length > 0);
    }

    isProcessInitiatorValid(): boolean {
        return (this.processInitiator && this.processInitiator.length > 0);
    }

    @HostListener('click')
    async onClick() {
        try {
            this.deleteProcess();
        } catch (error) {
            this.error.emit(error);
        }
    }

    private async deleteProcess() {
        const currentUser: string = this.identityUserService.getCurrentUserInfo().username;
        if (currentUser === this.processInitiator) {
            await this.processCloudService.deleteProcess(this.appName, this.processId)
                .subscribe((response) => {
                    this.success.emit(response);
                }, ((error) => {
                    this.error.emit(error);
                }));
        } else {
            this.error.emit('Permission denied');
        }

    }
}
