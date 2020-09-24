/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FormService, WidgetComponent } from '@alfresco/adf-core';
// tslint:disable:component-selector

@Component({
    selector: 'custom-editor-widget',
    template: `
        <div style="color: green">
            ADF version of custom form widget
        </div>
    `
})
export class CustomEditorComponent extends WidgetComponent {
    constructor() {
        super();
    }
}

@Component({
    selector: 'app-sample-widget',
    template: `
        <div style="color: red">
            <p *ngIf="field.readOnly || readOnly">
                <span>{{displayValue | json}}</span>
            </p>

            <mat-form-field *ngIf="!(field.readOnly || readOnly)">
                <label class="adf-label" [attr.for]="field.id">{{field.name | translate }}<span *ngIf="isRequired()">*</span></label>
                <textarea matInput
                       class="adf-input"
                       type="text"
                       [id]="field.id"
                       [required]="isRequired()"
                       [value]="field.value | json"
                       [(ngModel)]="field.value"
                       (ngModelChange)="onFieldChanged(field)">
                </textarea>
            </mat-form-field>
            <error-widget [error]="field.validationSummary"></error-widget>
            <error-widget *ngIf="isInvalidFieldRequired()" required="{{ 'FORM.FIELD.REQUIRED' | translate }}"></error-widget>
        </div>
    `
})
export class CustomWidgetComponent extends WidgetComponent  implements OnInit {

    displayValue: any;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        this.displayValue = this.field.value;
    }
}
