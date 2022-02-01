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

/* eslint-disable @angular-eslint/component-selector */

import { AfterViewInit, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../services/form.service';
import { FormFieldModel } from './core/index';

/**
 * Base widget component.
 */
@Component({
    selector: 'base-widget',
    template: '',
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
    encapsulation: ViewEncapsulation.None
})
export class WidgetComponent implements AfterViewInit {

    /** Does the widget show a read-only value? (ie, can't be edited) */
    @Input()
    readOnly: boolean = false;

    /** Data to be displayed in the field */
    @Input()
    field: FormFieldModel;

    /**
     * Emitted when a field value changes.
     */
    @Output()
    fieldChanged: EventEmitter<FormFieldModel> = new EventEmitter<FormFieldModel>();

    constructor(public formService?: FormService) {
    }

    hasField(): boolean {
        return !!this.field;
    }

    // Note for developers:
    // returns <any> object to be able binding it to the <element required="required"> attribute
    isRequired(): any {
        if (this.field && this.field.required) {
            return true;
        }
        return null;
    }

    isValid(): boolean {
        return !!this.field.validationSummary;
    }

    hasValue(): boolean {
        return this.field &&
            this.field.value !== null &&
            this.field.value !== undefined;
    }

    isInvalidFieldRequired() {
        return !this.field.isValid && !this.field.validationSummary && this.isRequired();
    }

    ngAfterViewInit() {
        this.fieldChanged.emit(this.field);
    }

    checkVisibility(field: FormFieldModel) {
        this.fieldChanged.emit(field);
    }

    onFieldChanged(field: FormFieldModel) {
        this.fieldChanged.emit(field);
    }

    event(event: Event): void {
        this.formService.formEvents.next(event);
    }
}
