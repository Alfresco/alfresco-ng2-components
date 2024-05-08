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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesServiceToken, IDebugFeaturesService } from '../interfaces/features.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-feature-flags-override-indicator',
    standalone: true,
    imports: [CommonModule],
    styles: [
        `
            .activity-indicator {
                font-size: 0.885rem;
            }
        `,
        `
            .activity-indicator .small {
                font-size: 0.7rem;
            }
        `,
        `
            .activity-indicator .large {
                font-size: 1.2rem;
            }
        `
    ],
    template: `
        <span [ngClass]="['activity-indicator', size]" *ngIf="isEnabled; else inActive">🟢</span>
        <ng-template #inActive><span [ngClass]="['activity-indicator', size]">🔴</span></ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagsOverrideComponent implements OnDestroy {
    isEnabled = false;
    destroy$ = new Subject<void>();

    @Input()
    size: 'small' | 'medium' | 'large' = 'medium';

    constructor(
        @Inject(FeaturesServiceToken)
        private featuresService: IDebugFeaturesService,
        changeDetectorRef: ChangeDetectorRef
    ) {
        // devTools: true means that FlagsOverrideToken is true (enable this component rendering)
        // production: true means the injected service doesn't implement the isEnabled method
        if (this.featuresService.isEnabled) {
            this.featuresService
                .isEnabled()
                .pipe(takeUntil(this.destroy$))
                .subscribe((isEnabled) => {
                    this.isEnabled = isEnabled;
                    changeDetectorRef.markForCheck();
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
