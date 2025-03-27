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

import { DestroyRef, inject, Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormService, FormSpinnerEvent } from '@alfresco/adf-core';
import { FormSpinnerComponent } from '../../components/spinner/form-spinner.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class FormCloudSpinnerService {
    private formService = inject(FormService);
    private overlay = inject(Overlay);

    private overlayRef?: OverlayRef = null;

    initSpinnerHandling(destroyRef: DestroyRef): void {
        this.formService.toggleFormSpinner.pipe(takeUntilDestroyed(destroyRef)).subscribe((event: FormSpinnerEvent) => {
            if (event?.payload.showSpinner && this.overlayRef === null) {
                this.overlayRef = this.overlay.create({
                    hasBackdrop: true
                });

                const userProfilePortal = new ComponentPortal(FormSpinnerComponent);
                const componentRef = this.overlayRef.attach(userProfilePortal);
                componentRef.instance.message = event.payload.message;
            } else if (event?.payload.showSpinner === false) {
                this.overlayRef?.detach();
                this.overlayRef = null;
            }
        });
    }
}
