/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createFieldsForm, renderWidget } from '../testing/widget-testing.mock';
import { SignalFormWidget } from './signal-form-widget';

@Component({ selector: 'adf-signal-probe-widget', template: '' })
class SignalProbeWidgetComponent extends SignalFormWidget<string> {
    readonly probedInputId = this.inputId;
    readonly probedReadOnly = this.readOnly;
    readonly probedRequired = this.fieldRequired;
    readonly probedFloatingLabel = this.showsFloatingLabel;
    readonly probedError = this.shownError;
    readonly probedFirstError = this.error;
    readonly probedErrorState = () => this.errorStateMatcher.isErrorState(null, null);
}

describe('SignalFormWidget', () => {
    const probe = (fieldJson: object, settings = {}) => {
        const form = createFieldsForm([{ id: 'name', type: 'text', ...fieldJson }], settings);
        const fixture = renderWidget(SignalProbeWidgetComponent, form, 'name');
        return { form, fixture, widget: fixture.componentInstance };
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should use the field id as input id, unless the outlet gives one', () => {
        const { fixture, widget } = probe({});
        expect(widget.probedInputId()).toBe('name');

        fixture.componentRef.setInput('elementId', 'name-Row0');

        expect(widget.probedInputId()).toBe('name-Row0');
    });

    it('should follow the read-only and required state of the field', () => {
        const { form, widget } = probe({ readOnly: true });
        expect(widget.probedReadOnly()).toBeTrue();
        expect(widget.probedRequired()).toBeFalse();

        form.setRequired('name', true);

        expect(widget.probedRequired()).toBeTrue();
    });

    it('should float the label for a named or required field, unless labels are on the left', () => {
        expect(probe({ name: 'Name' }).widget.probedFloatingLabel()).toBeTrue();
        expect(probe({ required: true }).widget.probedFloatingLabel()).toBeTrue();
        expect(probe({}).widget.probedFloatingLabel()).toBeFalse();
        expect(probe({ name: 'Name' }, { leftLabels: true }).widget.probedFloatingLabel()).toBeFalse();
    });

    it('should show a missing value once the field is touched', () => {
        const { form, widget } = probe({ required: true });
        expect(widget.probedError()).toBeNull();
        expect(widget.probedErrorState()).toBeFalse();

        form.fieldNode('name')().markAsTouched();

        expect(widget.probedError()).toEqual({ key: 'FORM.FIELD.REQUIRED' });
        expect(widget.probedErrorState()).toBeTrue();
    });

    it('should show a missing value when the form shows every error', () => {
        const { form, widget } = probe({ required: true });

        form.showAllErrors();

        expect(widget.probedError()).toEqual({ key: 'FORM.FIELD.REQUIRED' });
    });

    it('should have no error for a valid field', () => {
        const { widget } = probe({ value: 'Ada' });

        expect(widget.probedFirstError()).toBeNull();
        expect(widget.probedError()).toBeNull();
    });

    it("should show the form author's message for a pattern error", () => {
        const { widget } = probe({ value: 'abc', regexPattern: '[0-9]+', customValidationMessage: 'APP.DIGITS_ONLY' });

        expect(widget.probedError()).toEqual({ key: 'APP.DIGITS_ONLY' });
    });
});
