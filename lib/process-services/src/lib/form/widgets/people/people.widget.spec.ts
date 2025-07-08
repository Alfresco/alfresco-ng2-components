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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormFieldTypes, FormFieldModel, FormModel } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { PeopleWidgetComponent } from './people.widget';
import { TranslateService } from '@ngx-translate/core';
import { PeopleProcessService } from '../../../services/people-process.service';
import { LightUserRepresentation } from '@alfresco/js-api';
import { MatChipHarness } from '@angular/material/chips/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';

describe('PeopleWidgetComponent', () => {
    let widget: PeopleWidgetComponent;
    let fixture: ComponentFixture<PeopleWidgetComponent>;
    let element: HTMLElement;
    let loader: HarnessLoader;
    let translationService: TranslateService;
    let peopleProcessService: PeopleProcessService;

    const getChipById = async (id: string) =>
        loader.getHarness(MatChipHarness.with({ selector: `[data-automation-id="adf-people-widget-chip-${id}"]` }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PeopleWidgetComponent]
        });
        fixture = TestBed.createComponent(PeopleWidgetComponent);
        peopleProcessService = TestBed.inject(PeopleProcessService);
        loader = TestbedHarnessEnvironment.loader(fixture);

        translationService = TestBed.inject(TranslateService);
        spyOn(translationService, 'instant').and.callFake((key) => key);
        spyOn(translationService, 'get').and.callFake((key) => of(key));

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
        widget.field = new FormFieldModel(new FormModel());
        fixture.detectChanges();
    });

    describe('display name', () => {
        it('should return empty display name for missing model', () => {
            expect(widget.getDisplayName(null)).toBe('');
        });

        it('should return full name for a given model', () => {
            const model = {
                firstName: 'John',
                lastName: 'Doe'
            };
            expect(widget.getDisplayName(model)).toBe('John Doe');
        });

        it('should skip first name for display name', () => {
            const model = { firstName: null, lastName: 'Doe' };
            expect(widget.getDisplayName(model)).toBe('Doe');
        });

        it('should skip last name for display name', () => {
            const model = { firstName: 'John', lastName: null };
            expect(widget.getDisplayName(model)).toBe('John');
        });
    });

    it('should init value from the field', async () => {
        widget.field.value = {
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        };

        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));

        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const chip = await getChipById('people-id');
        expect(await chip.getText()).toBe('John Doe');
    });

    it('should show correct number of chips if multiple users provided', async () => {
        widget.field.readOnly = false;
        widget.field.params.multiple = true;
        widget.field.value = [
            {
                id: 'people-id-1',
                firstName: 'John',
                lastName: 'Doe'
            },
            {
                id: 'people-id-2',
                firstName: 'Rick',
                lastName: 'Grimes'
            }
        ];
        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const chips = await loader.getAllHarnesses(MatChipHarness);
        expect(chips.length).toBe(2);
        expect(await chips[0].getText()).toBe('John Doe');
        expect(await chips[1].getText()).toBe('Rick Grimes');
    });

    it('should show the readonly value when the form is readonly', async () => {
        widget.field.value = {
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        };
        widget.field.readOnly = true;
        widget.field.form.readOnly = true;

        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));

        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const chip = await getChipById('people-id');
        expect(await chip.getText()).toBe('John Doe');
        expect(await chip.isDisabled()).toBe(true);
        expect((element.querySelector('input') as HTMLInputElement).disabled).toBeTruthy();
    });

    it('should display the cancel button in the chip', async () => {
        widget.field.value = {
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe'
        };

        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));

        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const chip = await getChipById('people-id');
        const cancelIcon = await chip.getRemoveButton();
        expect(cancelIcon).toBeDefined();
    });

    it('should require form field to setup values on init', () => {
        widget.field.value = null;
        widget.ngOnInit();
        fixture.detectChanges();
        const input = widget.input;
        expect(input.nativeElement.value).toBe('');
        expect(widget.groupId).toBeUndefined();
    });

    it('should setup group restriction', () => {
        widget.ngOnInit();
        expect(widget.groupId).toBeUndefined();

        widget.field.params = { restrictWithGroup: { id: '<id>' } };
        widget.ngOnInit();
        expect(widget.groupId).toBe('<id>');
    });

    it('should display involved user in task form', async () => {
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(
            new Observable((observer) => {
                observer.next(null);
                observer.complete();
            })
        );

        widget.field.value = {
            id: 'people-id',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com'
        };
        widget.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();

        const chip = await getChipById('people-id');
        expect(await chip.getText()).toBe('John Doe');
    });

    it('should add user to selectedUsers when multiSelect is false and user is not already selected', () => {
        const user: LightUserRepresentation = { id: 1, firstName: 'John', lastName: 'Doe' };
        widget.multiSelect = false;
        widget.onItemSelect(user);
        expect(widget.selectedUsers).toContain(user);
        expect(widget.field.value).toEqual(widget.selectedUsers[0]);
    });

    it('should not add user to selectedUsers when multiSelect is true and user is already selected', () => {
        const user: LightUserRepresentation = { id: 1, firstName: 'John', lastName: 'Doe' };
        widget.multiSelect = true;
        widget.selectedUsers = [user];
        widget.onItemSelect(user);
        expect(widget.selectedUsers.length).toBe(1);
    });

    it('should clear the input value after selection', () => {
        const user: LightUserRepresentation = { id: 1, firstName: 'John', lastName: 'Doe' };
        widget.input.nativeElement.value = 'test';
        widget.onItemSelect(user);
        expect(widget.input.nativeElement.value).toBe('');
    });

    it('should reset the search term after selection', () => {
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of(null));
        const user: LightUserRepresentation = { id: 1, firstName: 'John', lastName: 'Doe' };
        widget.searchTerm.setValue('test');
        widget.onItemSelect(user);
        expect(widget.searchTerm.value).toBe('');
    });

    it('should remove user from selectedUsers if user exists', () => {
        const users: LightUserRepresentation[] = [
            { id: 1, firstName: 'John', lastName: 'Doe' },
            { id: 2, firstName: 'Jane', lastName: 'Doe' }
        ];

        widget.selectedUsers = [...users];
        widget.onRemove(users[0]);

        expect(widget.selectedUsers).not.toContain(users[0]);
        expect(widget.field.value).toEqual([users[1]]);
    });

    it('should not change selectedUsers if user does not exist', () => {
        const selectedUser: LightUserRepresentation = { id: 1, firstName: 'John', lastName: 'Doe' };
        const anotherUser: LightUserRepresentation = { id: 2, firstName: 'Jane', lastName: 'Doe' };
        widget.selectedUsers = [selectedUser];
        widget.onRemove(anotherUser);
        expect(widget.selectedUsers).toEqual([selectedUser]);
    });

    it('should set default value to field value if field can have multiple values', () => {
        widget.field.params.multiple = true;

        widget.ngOnInit();
        expect(widget.field.value).toEqual([]);
    });

    it('should not set default value to field value if field can not have multiple values', () => {
        widget.field.params.multiple = false;

        widget.ngOnInit();
        expect(widget.field.value).toBeUndefined();
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.PEOPLE,
                required: true
            });
        });

        it('should be marked as invalid after interaction', async () => {
            const peopleInput = fixture.nativeElement.querySelector('input');
            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeFalsy();

            peopleInput.dispatchEvent(new Event('blur'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.querySelector('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });

    describe('when template is ready', () => {
        const fakeUserResult: LightUserRepresentation[] = [
            { id: 1001, firstName: 'Test01', lastName: 'Test01', email: 'test' },
            { id: 1002, firstName: 'Test02', lastName: 'Test02', email: 'test2' }
        ];

        beforeEach(() => {
            spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(
                new Observable((observer) => {
                    observer.next(fakeUserResult);
                    observer.complete();
                })
            );
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'people-id',
                name: 'people-name',
                type: FormFieldTypes.PEOPLE,
                readOnly: false
            });
            fixture.detectChanges();
            element = fixture.nativeElement;
        });

        afterEach(() => {
            fixture.destroy();
        });

        afterAll(() => {
            TestBed.resetTestingModule();
        });

        it('should render the people component', () => {
            expect(element.querySelector('#people-widget-content')).not.toBeNull();
        });

        it('should show an error message if the user is invalid', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'K';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-error-text')).not.toBeNull();
            expect(element.querySelector('.adf-error-text').textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_VALUE');
        });

        it('should show the people if the typed result match', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
        });

        it('should hide result list if input is empty', async () => {
            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = '';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('focusin'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).toBeNull();
        });

        it('should display two options if we tap one letter', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const peopleHTMLElement = element.querySelector<HTMLInputElement>('input');
            peopleHTMLElement.focus();
            peopleHTMLElement.value = 'T';
            peopleHTMLElement.dispatchEvent(new Event('keyup'));
            peopleHTMLElement.dispatchEvent(new Event('input'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-0'))).not.toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-people-widget-user-1'))).not.toBeNull();
        });

        it('should emit peopleSelected if option is valid', async () => {
            const selectEmitSpy = spyOn(widget.peopleSelected, 'emit');
            widget.onItemSelect(fakeUserResult[0]);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(selectEmitSpy).toHaveBeenCalledWith(fakeUserResult[0].id);
        });

        it('should display tooltip when tooltip is set', async () => {
            widget.field.tooltip = 'people widget';

            fixture.detectChanges();
            await fixture.whenStable();

            const radioButtonsElement: any = element.querySelector('#people-id');
            const tooltip = radioButtonsElement.getAttribute('title');

            expect(tooltip).toEqual(widget.field.tooltip);
        });
    });
});
