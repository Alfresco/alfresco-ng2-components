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

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService, FormBaseModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    standalone: true,
    imports: [CommonModule, TranslatePipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormBaseModule],
    selector: 'adf-cloud-display-external-property',
    templateUrl: './display-external-property.widget.html',
    styleUrls: ['./display-external-property.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayExternalPropertyWidgetComponent extends WidgetComponent implements OnInit {
    propertyLoadFailed = false;
    previewState = false;
    propertyControl: FormControl;

    constructor(public readonly formService: FormService, private readonly formCloudService: FormCloudService) {
        super(formService);
    }

    ngOnInit(): void {
        this.initFormControl();
        this.initPreviewState();
        this.handleFailedPropertyLoad();
    }

    private initFormControl(): void {
        this.propertyControl = new FormControl(
            {
                value: this.field?.value,
                disabled: this.field?.readOnly || this.readOnly
            },
            this.isRequired() ? [Validators.required] : []
        );
    }

    private isPropertyLoadFailed(): boolean {
        return this.field.externalProperty && !this.field.value;
    }

    private handleFailedPropertyLoad(): void {
        if (this.isPropertyLoadFailed()) {
            this.handleError('External property not found');
        }
    }

    private initPreviewState(): void {
        this.previewState = this.formCloudService.getPreviewState();
    }

    private handleError(error: any): void {
        if (!this.previewState) {
            this.propertyLoadFailed = true;
            this.widgetError.emit(error);
        }
    }
}
