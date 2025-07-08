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

import { FormFieldModel, FormModel, FormFieldTypes, UnitTestingUtils } from '@alfresco/adf-core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { DisplayExternalPropertyWidgetComponent } from './display-external-property.widget';
import { FormCloudService } from '../../../services/form-cloud.service';
import { By } from '@angular/platform-browser';

describe('DisplayExternalPropertyWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: DisplayExternalPropertyWidgetComponent;
    let fixture: ComponentFixture<DisplayExternalPropertyWidgetComponent>;
    let element: HTMLElement;
    let formCloudService: FormCloudService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DisplayExternalPropertyWidgetComponent]
        });

        fixture = TestBed.createComponent(DisplayExternalPropertyWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        loader = TestbedHarnessEnvironment.loader(fixture);
        formCloudService = TestBed.inject(FormCloudService);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    it('should display initial value', async () => {
        widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
            type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
            readOnly: true,
            externalProperty: 'fruitName',
            value: 'banana'
        });

        fixture.detectChanges();

        const input = await loader.getHarness(MatInputHarness);
        expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();
        expect(await input.getValue()).toBe('banana');
    });

    it('should NOT display external property name in NO preview state', () => {
        widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
            type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
            readOnly: true,
            externalProperty: 'fruitName',
            value: 'banana'
        });

        fixture.detectChanges();

        const externalPropertyPreview = fixture.debugElement.query(By.css('[data-automation-id="adf-display-external-property-widget-preview"]'));
        expect(externalPropertyPreview).toBeFalsy();
    });

    describe('when property load fails', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
                externalProperty: 'fruitName',
                value: null
            });

            fixture.detectChanges();
        });

        it('should display the error message', () => {
            const errorElement = element.querySelector('error-widget');
            expect(errorElement.textContent.trim()).toContain('FORM.FIELD.EXTERNAL_PROPERTY_LOAD_FAILED');
        });
    });

    describe('when property is in preview state', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
                externalProperty: 'fruitName',
                params: { externalPropertyLabel: 'Fruit Name' },
                value: null
            });

            spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
            fixture.detectChanges();
        });

        it('should NOT display the error message', () => {
            const errorElement = element.querySelector('error-widget');
            expect(errorElement).toBeFalsy();
        });

        it('should display external property name', () => {
            const externalPropertyPreview = fixture.debugElement.query(By.css('[data-automation-id="adf-display-external-property-widget-preview"]'));
            expect(externalPropertyPreview.nativeElement.textContent.trim()).toBe('Fruit Name');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY,
                required: true
            });

            fixture.detectChanges();
        });

        it('should be able to display label with asterisk', async () => {
            const formField = await testingUtils.getMatFormField();
            const formControl = await formField.getControl();

            expect(formControl.isRequired).toBeTruthy();

            const inputField = await testingUtils.getByCSS('.adf-input').nativeElement;
            expect(inputField.hasAttribute('required')).toBeTruthy();
        });
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'external-property-id',
                name: 'external-property-name',
                value: '',
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY
            });

            fixture.detectChanges();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'external-property-id',
                name: 'external-property-name',
                value: '',
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY
            });

            fixture.detectChanges();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'external-property-id',
                name: 'external-property-name',
                value: '',
                type: FormFieldTypes.DISPLAY_EXTERNAL_PROPERTY
            });

            fixture.detectChanges();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });
    });
});
