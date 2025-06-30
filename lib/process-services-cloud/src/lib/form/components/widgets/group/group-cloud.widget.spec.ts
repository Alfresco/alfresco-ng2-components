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

import { FormFieldModel, FormFieldTypes, FormModel, IdentityGroupModel } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupCloudWidgetComponent } from './group-cloud.widget';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatChipHarness } from '@angular/material/chips/testing';

describe('GroupCloudWidgetComponent', () => {
    let fixture: ComponentFixture<GroupCloudWidgetComponent>;
    let widget: GroupCloudWidgetComponent;
    let element: HTMLElement;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessServiceCloudTestingModule, GroupCloudWidgetComponent]
        });
        fixture = TestBed.createComponent(GroupCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should have enabled validation if field is NOT readOnly', () => {
        const readOnly = false;
        widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }, null, readOnly), {
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

            const tooltip = cloudGroupInput.getAttribute('title');
            expect(tooltip).toEqual('my custom tooltip');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>', leftLabels: true }), {
                type: FormFieldTypes.GROUP,
                required: true
            });
        });

        it('should be able to display label with asterisk when leftLabel is tru', async () => {
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

        it('should be invalid after deselecting all groups', async () => {
            widget.onChangedGroup([{ id: 'test-id', name: 'test-name' }]);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-error-text')).toBeFalsy();

            const removeGroupIcon = element.querySelector('[data-automation-id="adf-cloud-group-chip-remove-icon-test-name"]');
            removeGroupIcon.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-error-text')).toBeTruthy();
            expect(element.querySelector('.adf-error-text').textContent).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUND');
        });
    });

    describe('when is readOnly', () => {
        const readOnly = true;

        it('should single chip be disabled', async () => {
            const mockSpaghetti: IdentityGroupModel[] = [
                {
                    id: 'bolognese',
                    name: 'Bolognese'
                }
            ];

            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }, null, readOnly), {
                type: FormFieldTypes.GROUP,
                value: mockSpaghetti
            });

            const groupChip = await loader.getHarness(MatChipHarness);
            expect(await groupChip.isDisabled()).toBeTrue();
        });

        it('should multi chips be disabled', async () => {
            const mockSpaghetti: IdentityGroupModel[] = [
                { id: 'bolognese', name: 'Bolognese' },
                { id: 'carbonara', name: 'Carbonara' }
            ];

            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }, null, readOnly), {
                type: FormFieldTypes.GROUP,
                value: mockSpaghetti
            });

            const groupChips = await loader.getAllHarnesses(MatChipHarness);
            expect(await groupChips[0].isDisabled()).toBeTrue();
            expect(await groupChips[1].isDisabled()).toBeTrue();
        });

        it('should have disabled validation', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }, null, readOnly), {
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
