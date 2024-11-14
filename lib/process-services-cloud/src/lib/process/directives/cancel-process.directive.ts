/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DestroyRef, Directive, ElementRef, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { ProcessCloudService } from '../services/process-cloud.service';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';
import { IdentityUserService } from '../../people/services/identity-user.service';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[adf-cloud-cancel-process]'
})
export class CancelProcessDirective implements OnInit {

    /** Emitted when the process is cancelled. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when the process cannot be cancelled. */
    @Output()
    error = new EventEmitter<any>();

    processInstanceDetails: ProcessInstanceCloud;

    canCancelProcess = false;

    private destroyRef = inject(DestroyRef);

    constructor(
        private elementRef: ElementRef,
        private processCloudService: ProcessCloudService,
        private identityUserService: IdentityUserService) {}

    ngOnInit() {
        this.processCloudService.dataChangesDetected
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((processDetails) => {
                this.processInstanceDetails = processDetails;
                this.canCancelProcess = this.checkCanCancelProcess();
                this.setElementVisibility();
            });
    }

    @HostListener('click')
    onClick() {
        this.cancelProcess();
    }

    private setElementVisibility() {
        this.elementRef.nativeElement.disabled = !this.canCancelProcess;
    }

    checkCanCancelProcess(): boolean {
        const currentUser = this.identityUserService.getCurrentUserInfo().username;
        return this.processInstanceDetails.initiator === currentUser && this.processInstanceDetails.status === 'RUNNING';
    }

    cancelProcess() {
        if (this.canCancelProcess) {
            this.processCloudService.cancelProcess(this.processInstanceDetails.appName, this.processInstanceDetails.id)
                .subscribe(
                    (response) => this.success.emit(response),
                    (error) => this.error.emit(error)
                );
        } else {
            this.error.emit('Permission denied, only process initiator can cancel the process');
        }
    }
}
