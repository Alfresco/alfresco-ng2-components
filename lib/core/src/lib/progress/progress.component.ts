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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ThemePalette } from '@angular/material/core';

export type ProgressVariant = 'bar' | 'spinner' | undefined;
export type ProgressMode = ProgressBarMode | ProgressSpinnerMode;
export type ProgressColor = ThemePalette;

@Component({
    selector: 'adf-progress',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
    templateUrl: './progress.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProgressComponent {
    private _mode: ProgressMode = 'indeterminate';
    private _value?: number;

    @Input() variant: ProgressVariant = 'bar';
    @Input() color?: ProgressColor;
    @Input() ariaLabel?: string;
    @Input() ariaHidden?: boolean;
    @Input() testId?: string;

    /**
     * The value of the progress bar or spinner.
     * Changes the mode to `determinate` if a value is provided.
     * @returns The progress value
     */
    get value(): number | undefined {
        return this._value;
    }

    @Input()
    set value(value: number | undefined) {
        if (value !== undefined) {
            this._mode = 'determinate';
        }
        this._value = value;
    }

    /**
     * The progress bar display mode. Defaults to `indeterminate`.
     *
     * For progress spinner, the mode can be either `indeterminate` or `determinate`.
     * For progress bar, the mode can be either `determinate`, `indeterminate`, `buffer`, or `query`.
     * @returns The progress mode
     */
    get mode(): ProgressMode {
        return this._mode;
    }

    @Input()
    set mode(value: ProgressMode) {
        if (this.variant === 'spinner') {
            if (value === 'indeterminate' || value === 'determinate') {
                this._mode = value;
            } else {
                this._mode = 'indeterminate';
            }
        } else {
            this._mode = value;
        }
    }
}
