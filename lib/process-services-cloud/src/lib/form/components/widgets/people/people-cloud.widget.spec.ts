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

import { FormFieldModel, FormFieldTypes, FormModel, IdentityUserModel, setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleCloudWidgetComponent } from './people-cloud.widget';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { mockShepherdsPie, mockYorkshirePudding } from '../../../../people/mock/people-cloud.mock';
import { By } from '@angular/platform-browser';

describe('PeopleCloudWidgetComponent', () => {
    let fixture: ComponentFixture<PeopleCloudWidgetComponent>;
    let widget: PeopleCloudWidgetComponent;
    let element: HTMLElement;
    let identityUserService: IdentityUserService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [
            PeopleCloudWidgetComponent
        ],
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA
        ]
    });

    beforeEach(() => {
        identityUserService = TestBed.inject(IdentityUserService);
        fixture = TestBed.createComponent(PeopleCloudWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(mockShepherdsPie);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should preselect the current user', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.PEOPLE,
            value: null,
            selectLoggedUser: true
        });
        fixture.detectChanges();
        expect(widget.preSelectUsers).toEqual([mockShepherdsPie]);
        expect(identityUserService.getCurrentUserInfo).toHaveBeenCalled();
    });

    it('should not preselect the current user if value exist', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.PEOPLE,
            value: [mockYorkshirePudding],
            selectLoggedUser: true
        });
        fixture.detectChanges();
        expect(widget.preSelectUsers).toEqual([mockYorkshirePudding]);
        expect(identityUserService.getCurrentUserInfo).not.toHaveBeenCalled();
    });

    it('should have enabled validation if field is NOT readOnly', () => {
        const readOnly = false;
        widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
            type: FormFieldTypes.PEOPLE,
            value: []
        });
        fixture.detectChanges();

        expect(widget.validate).toBeTruthy();
    });

    describe('when tooltip is set', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.PEOPLE,
                tooltip: 'my custom tooltip',
                value: [mockYorkshirePudding]
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const cloudPeopleInput = element.querySelector('adf-cloud-people');
            cloudPeopleInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip')).nativeElement;
            expect(tooltipElement).toBeTruthy();
            expect(tooltipElement.textContent.trim()).toBe('my custom tooltip');
          });

        it('should hide tooltip', async () => {
            const cloudPeopleInput = element.querySelector('adf-cloud-people');
            cloudPeopleInput.dispatchEvent(new Event('mouseenter'));
            await fixture.whenStable();
            fixture.detectChanges();

            cloudPeopleInput.dispatchEvent(new Event('mouseleave'));
            await fixture.whenStable();
            fixture.detectChanges();

            const tooltipElement = fixture.debugElement.query(By.css('.mat-tooltip'));
            expect(tooltipElement).toBeFalsy();
        });
    });

    describe('when is required', () => {

        beforeEach(() => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.PEOPLE,
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

            const cloudPeopleInput = element.querySelector('[data-automation-id="adf-people-cloud-search-input"]');
            cloudPeopleInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-invalid')).toBeTruthy();
        });
    });

    describe('when is readOnly', () => {

        const readOnly = true;

        it('should single chip be disabled', async () => {
            const mockSpaghetti: IdentityUserModel[] = [{
                id: 'bolognese',
                username: 'Bolognese',
                email: 'bolognese@example.com'
            }];

            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.PEOPLE,
                value: mockSpaghetti
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledFormField: HTMLElement = element.querySelector('.mat-form-field-disabled');
            expect(disabledFormField).toBeTruthy();

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledPeopleChip: HTMLElement = element.querySelector('.mat-chip-disabled');
            expect(disabledPeopleChip).toBeTruthy();
        });

        it('should multi chips be disabled', async () => {
            const mockSpaghetti: IdentityUserModel[] = [
                { id: 'bolognese', username: 'Bolognese', email: 'bolognese@example.com' },
                { id: 'carbonara', username: 'Carbonara', email: 'carbonara@example.com' }
            ];

            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.PEOPLE,
                value: mockSpaghetti
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledFormField: HTMLElement = element.querySelector('.mat-form-field-disabled');
            expect(disabledFormField).toBeTruthy();

            fixture.detectChanges();
            await fixture.whenStable();

            const disabledPeopleChips = element.querySelectorAll('.mat-chip-disabled');
            expect(disabledPeopleChips.item(0)).toBeTruthy();
            expect(disabledPeopleChips.item(1)).toBeTruthy();
        });

        it('should have disabled validation', () => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>'}, null, readOnly), {
                type: FormFieldTypes.PEOPLE,
                value: []
            });
            fixture.detectChanges();

            expect(widget.validate).toBeFalsy();
        });
    });

    describe('when form model has left labels', () => {

        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'people-id',
                name: 'people-name',
                value: '',
                type: FormFieldTypes.PEOPLE,
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
                id: 'people-id',
                name: 'people-name',
                value: '',
                type: FormFieldTypes.PEOPLE,
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
                id: 'people-id',
                name: 'people-name',
                value: '',
                type: FormFieldTypes.PEOPLE,
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
