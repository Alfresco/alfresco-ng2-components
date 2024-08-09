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

import { Component, OnInit } from '@angular/core';
import { ErrorWidgetComponent, FormService, WidgetComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'custom-editor-widget',
    standalone: true,
    template: ` <div style="color: green">ADF version of custom form widget</div> `
})
export class CustomEditorComponent extends WidgetComponent {
    constructor() {
        super();
    }
}

@Component({
    selector: 'app-sample-widget',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule, TranslateModule, FormsModule, ErrorWidgetComponent],
    template: `
        <div style="color: red">
            <p *ngIf="field.readOnly || readOnly">
                <label class="adf-label" [attr.for]="field.id">{{ field.name | translate }}<span *ngIf="isRequired()">*</span></label>
                <span>{{ field.value }}</span>
            </p>

            <mat-form-field *ngIf="!(field.readOnly || readOnly)">
                <label class="adf-label" [attr.for]="field.id">{{ field.name | translate }}<span *ngIf="isRequired()">*</span></label>
                <input
                    matInput
                    class="adf-input"
                    type="text"
                    [id]="field.id"
                    [required]="isRequired()"
                    [value]="field.value"
                    [(ngModel)]="field.value"
                    (ngModelChange)="onFieldChanged(field)"
                />
                <mat-hint>{{ field.placeholder }}</mat-hint>
            </mat-form-field>
            <error-widget [error]="field.validationSummary"></error-widget>
            <error-widget *ngIf="isInvalidFieldRequired()" required="{{ 'FORM.FIELD.REQUIRED' | translate }}"></error-widget>
        </div>
    `
})
export class CustomWidgetComponent extends WidgetComponent implements OnInit {
    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        this.field.value = typeof this.field.value === 'object' ? JSON.stringify(this.field.value) : this.field.value;
    }
}
