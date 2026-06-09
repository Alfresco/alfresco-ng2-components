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

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormBaseModule, FormFieldValueFormatterService, ADF_TYPED_VALUE_FORMATTING_ENABLED } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { isObservable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: true,
    imports: [CommonModule, TranslatePipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormBaseModule, MatIconModule],
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

    propertyErrorStateMatcher: ErrorStateMatcher = {
        isErrorState: () => this.propertyLoadFailed && !this.previewState
    };

    private readonly formCloudService = inject(FormCloudService);
    private readonly formatter = inject(FormFieldValueFormatterService);
    private readonly formattingEnabledToken = inject(ADF_TYPED_VALUE_FORMATTING_ENABLED, { optional: true });
    private readonly destroyRef = inject(DestroyRef);
    private formattingEnabled = false;

    ngOnInit(): void {
        if (isObservable(this.formattingEnabledToken)) {
            this.formattingEnabledToken.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
                this.formattingEnabled = enabled ?? false;
                if (this.propertyControl) {
                    this.propertyControl.setValue(this.computeDisplayValue());
                }
            });
        } else {
            this.formattingEnabled = this.formattingEnabledToken ?? false;
        }
        this.initFormControl();
        this.initPreviewState();
        this.handleFailedPropertyLoad();
    }

    private computeDisplayValue(): unknown {
        const value = this.field?.value;
        const isFormattableValue = value != null && typeof value !== 'string';
        if (this.formattingEnabled && isFormattableValue && this.formatter.hasFormatter(this.field?.type ?? '')) {
            return this.formatter.format(this.field);
        }
        return value;
    }

    private initFormControl(): void {
        this.propertyControl = new FormControl(
            {
                value: this.computeDisplayValue(),
                disabled: !!(this.field?.readOnly || this.readOnly)
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
