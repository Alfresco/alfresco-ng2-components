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
import { NgFor } from '@angular/common';

@Component({
    selector: 'adf-form-section',
    templateUrl: './form-section.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./form-section.component.scss'],
    imports: [NgFor, FormFieldComponent]
})
export class FormSectionComponent implements OnInit {
    @Input()
    field: FormFieldModel = null;

    private readonly visibilityService = inject(WidgetVisibilityService);

    ngOnInit(): void {
        this.visibilityService.refreshVisibility(this.field.form);
    }

    getSectionColumnWidth(numberOfColumns: number, columnFields: FormFieldModel[]): string {
        const firstColumnFieldIndex = 0;
        const defaultColspan = 1;
        const fieldColspan = columnFields[firstColumnFieldIndex]?.colspan ?? defaultColspan;

        if (typeof numberOfColumns !== 'number' || !numberOfColumns || numberOfColumns <= 0) {
            numberOfColumns = 1;
        }

        return Math.min(100, (100 / numberOfColumns) * fieldColspan) + '';
    }
}
