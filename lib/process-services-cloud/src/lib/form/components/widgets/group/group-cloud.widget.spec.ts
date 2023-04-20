/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldModel, FormFieldTypes, FormModel, IdentityGroupModel, setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupCloudWidgetComponent } from './group-cloud.widget';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GroupCloudWidgetComponent', () => {
    let fixture: ComponentFixture<GroupCloudWidgetComponent>;
    let widget: GroupCloudWidgetComponent;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [
            GroupCloudWidgetComponent
        ],
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should have enabled validation if field is NOT readOnly', () => {
        const readOnly = false;
        widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }, null, readOnly), {
            type: FormFieldTypes.GROUP,
            value: []
        });
        fixture.detectChanges();

        expect(widget.validate).toBeTruthy();
    });

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.GROUP,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const cloudGroupInput = element.querySelector('adf-cloud-group');
            cloudGroupInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const cloudGroupInput = element.querySelector('[data-automation-id="adf-cloud-group-search-input"]');
            cloudGroupInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            cloudGroupInput.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
        });
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.GROUP,
                required: true
            });
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });

        it('should be invalid after user interaction without typing', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeFalsy();

            const cloudGroupInput = element.querySelector('[data-automation-id="adf-cloud-group-search-input"]');
            cloudGroupInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();
        });
    });

    describe('when is readOnly', () => {

        const readOnly = true;

        it('should single chip be disabled', async () => {
            const mockSpaghetti: IdentityGroupModel[] = [{
                id: 'bolognese',
                name: 'Bolognese'
            }];

            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.GROUP,
                value: mockSpaghetti
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledFormField: HTMLElement = element.querySelector('.mat-form-field-disabled');
            expect(disabledFormField).toBeTruthy();

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledGroupChip: HTMLElement = element.querySelector('.mat-chip-disabled');
            expect(disabledGroupChip).toBeTruthy();
        });

        it('should multi chips be disabled', async () => {
            const mockSpaghetti: IdentityGroupModel[] = [
                { id: 'bolognese', name: 'Bolognese' },
                { id: 'carbonara', name: 'Carbonara' }
            ];

            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.GROUP,
                value: mockSpaghetti
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledFormField: HTMLElement = element.querySelector('.mat-form-field-disabled');
            expect(disabledFormField).toBeTruthy();

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledGroupChips = element.querySelectorAll('.mat-chip-disabled');
            expect(disabledGroupChips.item(0)).toBeTruthy();
            expect(disabledGroupChips.item(1)).toBeTruthy();
        });

        it('should have disabled validation', () => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.GROUP,
                value: []
            });
            fixture.detectChanges();

            expect(widget.validate).toBeFalsy();
        });
    });

    describe('when form model has left labels', () => {

        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'group-id',
                name: 'group-name',
                value: '',
                type: FormFieldTypes.GROUP,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'group-id',
                name: 'group-name',
                value: '',
                type: FormFieldTypes.GROUP,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'group-id',
                name: 'group-name',
                value: '',
                type: FormFieldTypes.GROUP,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = element.querySelector('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = element.querySelector('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });
    });
});
