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

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { FormFieldModel, FormFieldTypes, FormModel, FormService } from '@alfresco/adf-core';
import { of, Subject, throwError } from 'rxjs';
import { CheckboxGroupWidgetComponent } from './checkbox-group.widget';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';

const options = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' }
];

describe('CheckboxGroupWidgetComponent', () => {
    let fixture: ComponentFixture<CheckboxGroupWidgetComponent>;
    let widget: CheckboxGroupWidgetComponent;
    let taskService: jasmine.SpyObj<TaskFormService>;
    let processService: jasmine.SpyObj<ProcessDefinitionService>;
    const createField = (config: any = {}, form = new FormModel()) =>
        new FormFieldModel(form, {
            id: 'choices',
            name: 'Choices',
            type: FormFieldTypes.CHECKBOX_GROUP,
            options,
            ...config
        });
    const checkboxes = () => TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(MatCheckboxHarness);

    beforeEach(() => {
        taskService = jasmine.createSpyObj('TaskFormService', ['getRestFieldValues']);
        processService = jasmine.createSpyObj('ProcessDefinitionService', ['getRestFieldValuesByProcessId']);
        TestBed.configureTestingModule({
            imports: [CheckboxGroupWidgetComponent],
            providers: [
                { provide: TaskFormService, useValue: taskService },
                { provide: ProcessDefinitionService, useValue: processService }
            ]
        });
        fixture = TestBed.createComponent(CheckboxGroupWidgetComponent);
        widget = fixture.componentInstance;
        widget.field = createField();
    });

    it('should render all options unchecked with an accessible group label', async () => {
        fixture.detectChanges();
        const boxes = await checkboxes();
        expect(boxes.length).toBe(2);
        expect(await boxes[0].getLabelText()).toBe('Alpha');
        expect(await boxes[0].isChecked()).toBeFalse();
        expect(await boxes[1].isChecked()).toBeFalse();
        expect(fixture.nativeElement.querySelector('[role="group"]').getAttribute('aria-labelledby')).toBe('choices-label');
    });

    for (const readOnly of [false, true]) {
        it(`should apply custom styling only to the title when readonly is ${readOnly}`, () => {
            widget.field = createField({ readOnly });
            fixture.detectChanges();
            const host: HTMLElement = fixture.nativeElement;
            const title = host.querySelector<HTMLElement>('.adf-checkbox-group-widget > .adf-label');
            const items = Array.from(host.querySelectorAll<HTMLElement>('.adf-checkbox-group-option-label'));
            const typography = (element: HTMLElement) => {
                const style = getComputedStyle(element);
                return { size: style.fontSize, weight: style.fontWeight, color: style.color };
            };
            expect(items.length).toBe(2);
            const originalItemStyles = items.map(typography);
            host.style.setProperty('--adf-checkbox-group-font-size', '24px');
            host.style.setProperty('--adf-checkbox-group-font-weight', '700');
            host.style.setProperty('--adf-checkbox-group-color', 'purple');
            expect(typography(title)).toEqual({ size: '24px', weight: '700', color: 'rgb(128, 0, 128)' });
            expect(items.map(typography)).toEqual(originalItemStyles);

            host.style.removeProperty('--adf-checkbox-group-font-size');
            host.style.removeProperty('--adf-checkbox-group-font-weight');
            host.style.removeProperty('--adf-checkbox-group-color');
            host.style.setProperty('--adf-form-label-font-size', '20px');
            host.style.setProperty('--adf-form-label-font-weight', '600');
            host.style.setProperty('--adf-form-label-color', 'green');
            expect(typography(title)).toEqual({ size: '20px', weight: '600', color: 'rgb(0, 128, 0)' });
            expect(items.map(typography)).toEqual(originalItemStyles);
        });
    }

    it('should select several options, avoid duplicates and deselect one', async () => {
        fixture.detectChanges();
        const boxes = await checkboxes();
        await boxes[0].check();
        await boxes[1].check();
        expect(widget.field.form.values.choices).toEqual(options);
        widget.onSelectionChange(options[1], true);
        expect(widget.field.form.values.choices).toEqual(options);
        await boxes[0].uncheck();
        expect(widget.field.form.values.choices).toEqual([options[1]]);
        await boxes[1].uncheck();
        expect(widget.field.form.values.choices).toEqual([]);
    });

    it('should keep the selection in option order regardless of click order', () => {
        fixture.detectChanges();
        widget.onSelectionChange(options[1], true);
        widget.onSelectionChange(options[0], true);
        expect(widget.field.form.values.choices).toEqual(options);

        widget.onSelectionChange(options[0], false);
        widget.onSelectionChange(options[0], true);
        expect(widget.field.form.values.choices).toEqual(options);
    });

    it('should keep saved selections that are no longer available after the current options', () => {
        const stale = { id: 'old', name: 'Old' };
        widget.field = createField({ value: [stale, options[1]] });
        fixture.detectChanges();
        widget.onSelectionChange(options[0], true);
        expect(widget.field.form.values.choices).toEqual([options[0], options[1], stale]);
    });

    it('should render saved selections', async () => {
        widget.field = createField({ value: options });
        fixture.detectChanges();
        const boxes = await checkboxes();
        expect(await boxes[0].isChecked()).toBeTrue();
        expect(await boxes[1].isChecked()).toBeTrue();
    });

    it('should emit normal field and rule events when changed', () => {
        fixture.detectChanges();
        const changed = spyOn(widget.fieldChanged, 'emit');
        const rules = spyOn(TestBed.inject(FormService).formRulesEvent, 'next');
        const update = spyOn(widget.field.form, 'onFormFieldChanged').and.callThrough();
        widget.onSelectionChange(options[0], true);
        expect(changed).toHaveBeenCalledWith(widget.field);
        expect(update).toHaveBeenCalledWith(widget.field);
        expect(rules).toHaveBeenCalled();
        expect(widget.touched).toBeTrue();
    });

    for (const disabledBy of ['field', 'widget', 'form', 'loading']) {
        it(`should prevent changes when disabled by ${disabledBy}`, async () => {
            widget.field = createField(
                { value: [options[0]], readOnly: disabledBy === 'field' },
                new FormModel({}, undefined, disabledBy === 'form')
            );
            widget.readOnly = disabledBy === 'widget';
            widget.loading.set(disabledBy === 'loading');
            fixture.detectChanges();
            const boxes = await checkboxes();
            expect(await boxes[0].isChecked()).toBeTrue();
            expect(await boxes[0].isDisabled()).toBeTrue();
            widget.onSelectionChange(options[1], true);
            expect(widget.field.value).toEqual([options[0]]);
        });
    }

    it('should show required validation after interaction and on submission', async () => {
        widget.field = createField({ required: true, tooltip: 'Choose some', alignmentType: 'horizontal', className: 'custom' });
        fixture.detectChanges();
        expect(widget.field.isValid).toBeFalse();
        expect(widget.field.validationSummary.isActive()).toBeFalse();
        expect(fixture.nativeElement.querySelector('error-widget')).toBeNull();
        widget.field.form.showAllValidationErrors = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('error-widget')).not.toBeNull();
        expect(fixture.nativeElement.querySelectorAll('.adf-error-text').length).toBe(1);
        expect(fixture.nativeElement.querySelector('.adf-checkbox-group-horizontal')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.custom')).not.toBeNull();
        const [checkbox] = await checkboxes();
        expect(await (await checkbox.host()).getAttribute('title')).toBe('Choose some');
        widget.onSelectionChange(options[0], true);
        expect(widget.field.isValid).toBeTrue();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.adf-error-text')).toBeNull();
        widget.onSelectionChange(options[0], false);
        expect(widget.field.isValid).toBeFalse();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.adf-error-text').length).toBe(1);
    });

    describe('accessibility state', () => {
        const group = () => fixture.nativeElement.querySelector('[role="group"]');

        it('should not announce an untouched required group as invalid or described by an empty error', () => {
            widget.field = createField({ required: true });
            fixture.detectChanges();

            expect(widget.field.isValid).toBeFalse();
            expect(group().getAttribute('aria-invalid')).not.toBe('true');
            expect(group().hasAttribute('aria-describedby')).toBeFalse();
        });

        it('should announce the error once the group is touched', () => {
            widget.field = createField({ required: true });
            widget.markAsTouched();
            fixture.detectChanges();

            expect(group().getAttribute('aria-invalid')).toBe('true');
            expect(group().getAttribute('aria-describedby')).toBe('choices-error');
            expect(fixture.nativeElement.querySelector('#choices-error')).not.toBeNull();
        });

        it('should announce the error on submission', () => {
            widget.field = createField({ required: true });
            widget.field.form.showAllValidationErrors = true;
            fixture.detectChanges();

            expect(group().getAttribute('aria-invalid')).toBe('true');
            expect(group().getAttribute('aria-describedby')).toBe('choices-error');
        });

        it('should not be invalid once a valid selection is made', () => {
            widget.field = createField({ required: true });
            widget.markAsTouched();
            fixture.detectChanges();
            widget.onSelectionChange(options[0], true);
            fixture.detectChanges();

            expect(group().getAttribute('aria-invalid')).toBe('false');
        });
    });

    describe('change detection cost', () => {
        const manyOptions = Array.from({ length: 50 }, (_, index) => ({ id: `o${index}`, name: `Option ${index}` }));

        it('should read the form value once per render instead of once per option', () => {
            widget.field = createField({ options: manyOptions, value: manyOptions.slice(0, 5) });
            const spy = spyOn(widget.field, 'getFormValue').and.callThrough();
            fixture.detectChanges();

            expect(spy.calls.count()).toBeLessThanOrEqual(2);
        });

        it('should reflect selection changes and external value updates', async () => {
            widget.field = createField({ options: manyOptions, value: [manyOptions[0]] });
            fixture.detectChanges();
            const checked = async () => {
                const states = await Promise.all((await checkboxes()).map((box) => box.isChecked()));
                return states.filter(Boolean).length;
            };
            expect(await checked()).toBe(1);

            widget.onSelectionChange(manyOptions[1], true);
            expect(await checked()).toBe(2);

            widget.field.value = [];
            expect(await checked()).toBe(0);

            widget.field.options = manyOptions.slice(0, 1);
            widget.field.value = [manyOptions[0], manyOptions[5]];
            expect(await checked()).toBe(1);
        });
    });

    it('should display a custom validation summary without a duplicate required error', () => {
        widget.field = createField({ required: true });
        widget.markAsTouched();
        widget.field.validationSummary.message = 'Custom error';
        fixture.detectChanges();

        const errors = fixture.nativeElement.querySelectorAll('.adf-error-text');
        expect(errors.length).toBe(1);
        expect(errors[0].textContent).toContain('Custom error');
    });

    for (const config of [null, {}, { optionType: 'variable' }, { optionType: 'rest' }, { optionType: 'rest', restUrl: '/options' }]) {
        it(`should skip REST for missing field/configuration/context: ${JSON.stringify(config)}`, () => {
            widget.field = config === null ? null : createField(config);
            widget.ngOnInit();
            expect(taskService.getRestFieldValues).not.toHaveBeenCalled();
            expect(processService.getRestFieldValuesByProcessId).not.toHaveBeenCalled();
        });
    }

    it('should skip REST in a readonly form', () => {
        widget.field = createField({ optionType: 'rest', restUrl: '/options' }, new FormModel({ taskId: 'task' }, undefined, true));
        widget.ngOnInit();
        expect(taskService.getRestFieldValues).not.toHaveBeenCalled();
    });

    for (const context of [{ taskId: 'task' }, { processDefinitionId: 'process' }]) {
        it(`should load REST options for ${JSON.stringify(context)} without auto-selection`, () => {
            const service = context.taskId ? taskService.getRestFieldValues : processService.getRestFieldValuesByProcessId;
            const response = new Subject<typeof options>();
            service.and.returnValue(response);
            widget.field = createField({ optionType: 'rest', restUrl: '/options' }, new FormModel(context));
            widget.ngOnInit();
            expect(widget.loading()).toBeTrue();
            expect(widget.disabled).toBeTrue();
            expect(service).toHaveBeenCalledWith(context.taskId || context.processDefinitionId, 'choices');
            response.next(options);
            response.complete();
            expect(widget.loading()).toBeFalse();
            expect(widget.field.options).toEqual(options);
            expect(widget.field.form.values.choices).toEqual([]);
        });

        for (const returnedOptions of [[options[1]], [], null]) {
            it(`should remove unavailable selections and revalidate for ${JSON.stringify(context)} with ${JSON.stringify(returnedOptions)}`, () => {
                const service = context.taskId ? taskService.getRestFieldValues : processService.getRestFieldValuesByProcessId;
                const response = new Subject<typeof options>();
                service.and.returnValue(response);
                widget.field = createField({ optionType: 'rest', restUrl: '/options', required: true, value: options }, new FormModel(context));
                widget.ngOnInit();
                expect(widget.field.isValid).toBeTrue();

                response.next(returnedOptions);
                response.complete();

                expect(widget.field.value).toEqual(returnedOptions || []);
                expect(widget.field.form.values.choices).toEqual(returnedOptions || []);
                expect(widget.field.isValid).toBe(!!returnedOptions?.length);
                widget.field.required = false;
                expect(widget.field.isValid).toBeTrue();
            });
        }
    }

    it('should handle an empty REST response', () => {
        taskService.getRestFieldValues.and.returnValue(of(null));
        widget.field = createField({ optionType: 'rest', restUrl: '/options' }, new FormModel({ taskId: 'task' }));
        widget.ngOnInit();
        expect(widget.field.options).toEqual([]);
        expect(widget.loading()).toBeFalse();
    });

    it('should retain saved selections after loading and failures', () => {
        widget.field = createField({ optionType: 'rest', restUrl: '/options', value: options }, new FormModel({ taskId: 'task' }));
        taskService.getRestFieldValues.and.returnValue(of(options));
        widget.ngOnInit();
        expect(widget.field.form.values.choices).toEqual(options);
        const error = new Error('unavailable');
        taskService.getRestFieldValues.and.returnValue(throwError(() => error));
        const emitted = spyOn(widget.widgetError, 'emit');
        widget.ngOnInit();
        expect(emitted).toHaveBeenCalledWith(error);
        expect(widget.loading()).toBeFalse();
        expect(widget.field.form.values.choices).toEqual(options);
    });

    it('should unsubscribe from pending REST requests on destruction', () => {
        const response = new Subject<typeof options>();
        taskService.getRestFieldValues.and.returnValue(response);
        widget.field = createField({ optionType: 'rest', restUrl: '/options' }, new FormModel({ taskId: 'task' }));
        widget.ngOnInit();
        fixture.destroy();
        expect(response.observed).toBeFalse();
        expect(widget.loading()).toBeFalse();
    });
});

describe('CheckboxGroupWidgetComponent without zone.js', () => {
    it('should render REST options and clear the busy state once they load', async () => {
        const response = new Subject<typeof options>();
        TestBed.configureTestingModule({
            imports: [CheckboxGroupWidgetComponent],
            providers: [
                provideZonelessChangeDetection(),
                { provide: TaskFormService, useValue: { getRestFieldValues: () => response } },
                { provide: ProcessDefinitionService, useValue: {} }
            ]
        });
        const fixture = TestBed.createComponent(CheckboxGroupWidgetComponent);
        fixture.componentInstance.field = new FormFieldModel(new FormModel({ taskId: 'task' }), {
            id: 'choices',
            name: 'Choices',
            type: FormFieldTypes.CHECKBOX_GROUP,
            optionType: 'rest',
            restUrl: '/options'
        });
        await fixture.whenStable();
        const group: HTMLElement = fixture.nativeElement.querySelector('[role="group"]');
        const loader = TestbedHarnessEnvironment.loader(fixture);
        expect(group.getAttribute('aria-busy')).toBe('true');
        expect((await loader.getAllHarnesses(MatCheckboxHarness)).length).toBe(0);

        response.next(options);
        response.complete();
        await fixture.whenStable();

        expect(group.getAttribute('aria-busy')).toBe('false');
        expect((await loader.getAllHarnesses(MatCheckboxHarness)).length).toBe(2);
    });
});
