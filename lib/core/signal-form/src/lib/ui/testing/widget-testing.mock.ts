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

import { Injector, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { FieldJson, FormDefinitionContentJson } from '../../definition/form-definition-json.interface';
import { parseFormJson } from '../../definition/form-json-parser';
import { SignalForm, SignalFormOptions } from '../../state/signal-form';

/**
 * Builds a form holding the given fields in one container.
 *
 * @param fields the fields
 * @param settings the form's own settings, such as `leftLabels`
 * @param options the form options
 * @returns the form
 */
export const createFieldsForm = (fields: FieldJson[], settings: FormDefinitionContentJson = {}, options: SignalFormOptions = {}): SignalForm =>
    new SignalForm(
        parseFormJson({
            formDefinition: {
                fields: [{ id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: fields } }],
                outcomes: [],
                variables: [],
                ...settings
            }
        }),
        options,
        TestBed.inject(Injector)
    );

/**
 * Renders a widget for one field of a form, with the inputs the field outlet gives it.
 *
 * @param component the widget component
 * @param form the form
 * @param fieldId the field the widget shows
 * @returns the rendered widget
 */
export const renderWidget = <TWidget>(component: Type<TWidget>, form: SignalForm, fieldId: string): ComponentFixture<TWidget> => {
    const fixture = TestBed.createComponent(component);
    fixture.componentRef.setInput('form', form);
    fixture.componentRef.setInput('field', form.fieldNode(fieldId));
    fixture.componentRef.setInput('definition', form.fieldDefinition(fieldId));
    fixture.detectChanges();
    return fixture;
};

/**
 * Types a text into an input or a textarea, as a user does: the value changes, then the input event fires.
 *
 * @param input the input or textarea
 * @param text the text
 */
export const typeInto = (input: HTMLInputElement | HTMLTextAreaElement, text: string): void => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
};

/**
 * Pastes a text into an input, as a user does.
 *
 * @param input the input
 * @param text the text
 * @returns the paste event, so a test can see whether the paste was refused
 */
export const pasteInto = (input: HTMLInputElement, text: string): ClipboardEvent => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text', text);
    const event = new ClipboardEvent('paste', { clipboardData, cancelable: true });
    input.dispatchEvent(event);
    return event;
};

/**
 * Reads the text of the error a widget shows.
 *
 * @param element the widget element
 * @returns the error text, or undefined when no error is shown
 */
export const errorText = (element: HTMLElement): string | undefined => element.querySelector('.adf-error-text')?.textContent?.trim();
