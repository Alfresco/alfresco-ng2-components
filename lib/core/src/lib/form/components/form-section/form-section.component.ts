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

import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetVisibilityService } from '../../services/widget-visibility.service';
import { FormFieldModel } from '../widgets/core/form-field.model';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
    selector: 'adf-form-section',
    templateUrl: './form-section.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./form-section.component.scss'],
    imports: [FormFieldComponent]
})
export class FormSectionComponent implements OnInit {
    @Input()
    field: FormFieldModel = null;

    private readonly visibilityService = inject(WidgetVisibilityService);

    ngOnInit(): void {
        this.visibilityService.refreshVisibility(this.field.form);
    }

    getSectionColumnWidth(numberOfColumns: number, columns: Array<{ fields: FormFieldModel[] }>, columnIndex: number): string {
        if (typeof numberOfColumns !== 'number' || !numberOfColumns || numberOfColumns <= 0) {
            numberOfColumns = 1;
        }

        const defaultColumnWidth = 100 / numberOfColumns;
        const columnFields = columns?.[columnIndex]?.fields ?? [];

        if (!columnFields || columnFields.length === 0) {
            return this.isColumnCoveredByPreviousField(columns, columnIndex) ? '0' : defaultColumnWidth + '';
        }

        const maxColspan = Math.max(...columnFields.map((field) => field.colspan || 1));
        return Math.min(100, defaultColumnWidth * maxColspan) + '';
    }

    private isColumnCoveredByPreviousField(columns: Array<{ fields: FormFieldModel[] }>, columnIndex: number): boolean {
        if (!columns || columnIndex <= 0) {
            return false;
        }

        for (let previousColumnIndex = 0; previousColumnIndex < columnIndex; previousColumnIndex++) {
            const previousFields = columns[previousColumnIndex]?.fields ?? [];

            if (previousFields.length === 0) {
                continue;
            }

            const previousColumnSpan = Math.max(...previousFields.map((field) => field.colspan || 1));
            if (previousColumnIndex + previousColumnSpan > columnIndex) {
                return true;
            }
        }

        return false;
    }
}
