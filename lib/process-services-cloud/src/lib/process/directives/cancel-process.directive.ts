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
import { Directive, HostListener, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { IdentityUserService } from '@alfresco/adf-core';
import { ProcessCloudService } from '../services/process-cloud.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';

@Directive({
    selector: '[adf-cloud-cancel-process]'
})
export class CancelProcessDirective implements OnInit, OnDestroy {

    /** Emitted when the process is cancelled. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the process cannot be cancelled. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    /** Emitted when the can cancel process status is checked */
    canCancelProcess: EventEmitter<boolean> = new EventEmitter<boolean>();

    processInstanceDetails: ProcessInstanceCloud;

    invalidParams: string[] = [];

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private processCloudService: ProcessCloudService,
        private identityUserService: IdentityUserService) {}

    ngOnInit() {
        this.processCloudService.dataChangesDetected$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processDetails: ProcessInstanceCloud) => {
                this.processInstanceDetails = processDetails;
                const currentUser: string = this.identityUserService.getCurrentUserInfo().username;
                this.canCancelProcess.emit(this.processCloudService.canCancelProcess(this.processInstanceDetails, currentUser));
            });
    }

    @HostListener('click')
    async onClick() {
        try {
            this.cancelProcess();
        } catch (error) {
            this.error.emit(error);
        }
    }

    private async cancelProcess() {
        const currentUser: string = this.identityUserService.getCurrentUserInfo().username;
        if (this.processCloudService.canCancelProcess(this.processInstanceDetails, currentUser)) {
            await this.processCloudService.cancelProcess(this.processInstanceDetails.appName, this.processInstanceDetails.id)
                .subscribe((response) => {
                    this.success.emit(response);
                }, ((error) => {
                    this.error.emit(error);
                }));
        } else {
            this.error.emit('Permission denied, only process initiator can cancel the process');
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
