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

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesServiceToken, IDebugFeaturesService } from '../interfaces/features.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-feature-flags-override-indicator',
    imports: [CommonModule],
    styles: [
        `
            .adf-activity-indicator {
                font-size: 0.885rem;
            }
        `,
        `
            .adf-activity-indicator .small {
                font-size: 0.7rem;
            }
        `,
        `
            .adf-activity-indicator .large {
                font-size: 1.2rem;
            }
        `
    ],
    template: `
        @if (isEnabled) {
          <span [ngClass]="['activity-indicator', size]">🟢</span>
        } @else {
          <span [ngClass]="['activity-indicator', size]">🔴</span>
        }
        `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagsOverrideComponent {
    private readonly featuresService = inject<IDebugFeaturesService>(FeaturesServiceToken);

    isEnabled = false;

    @Input()
    size: 'small' | 'medium' | 'large' = 'medium';

    constructor() {
        const changeDetectorRef = inject(ChangeDetectorRef);

        if (this.featuresService.isEnabled$) {
            this.featuresService
                .isEnabled$()
                .pipe(takeUntilDestroyed())
                .subscribe((isEnabled) => {
                    this.isEnabled = isEnabled;
                    changeDetectorRef.markForCheck();
                });
        }
    }
}
