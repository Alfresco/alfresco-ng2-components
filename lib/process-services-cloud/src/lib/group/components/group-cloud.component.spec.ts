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

/* tslint:disable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from './../../testing/process-service-cloud.testing.module';

import { GroupCloudModule } from '../group-cloud.module';
import { GroupCloudComponent } from './group-cloud.component';
import {
    setupTestBed,
    IdentityGroupService,
    mockIdentityGroups,
    AlfrescoApiService,
    CoreModule
} from '@alfresco/adf-core';
import { SimpleChange } from '@angular/core';

xdescribe('GroupCloudComponent', () => {
    let component: GroupCloudComponent;
    let fixture: ComponentFixture<GroupCloudComponent>;
    let element: HTMLElement;
    let identityGroupService: IdentityGroupService;
    let alfrescoApiService: AlfrescoApiService;
    let findGroupsByNameSpy: jasmine.Spy;

    const mock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(mockIdentityGroups)
        }
    };

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            ProcessServiceCloudTestingModule,
            GroupCloudModule],
        providers: [
            IdentityGroupService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        identityGroupService = TestBed.get(IdentityGroupService);
        alfrescoApiService = TestBed.get(AlfrescoApiService);
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
    });

    it('should create GroupCloudComponent', () => {
        expect(component instanceof GroupCloudComponent).toBeTruthy();
    });

    it('should populate placeholder when title is present', async(() => {
        component.title = 'TITLE_KEY';
        fixture.detectChanges();
        const matLabel: HTMLInputElement = <HTMLInputElement> element.querySelector('#adf-group-cloud-title-id');
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(matLabel.textContent).toEqual('TITLE_KEY');
        });
    }));

    describe('Search group', () => {

        beforeEach(async(() => {
            fixture.detectChanges();
            element = fixture.nativeElement;
            findGroupsByNameSpy = spyOn(identityGroupService, 'findGroupsByName').and.returnValue(of(mockIdentityGroups));
        }));

        it('should list the group if the typed result match', (done) => {
            findGroupsByNameSpy.and.returnValue(of(mockIdentityGroups));
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'Mock';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(5);
                expect(findGroupsByNameSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should hide result list if input is empty', (done) => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = '';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('mat-option')).toBeNull();
                done();
            });
        });

        it('should emit selectedGroup if option is valid', (done) => {
            fixture.detectChanges();
            const selectEmitSpy = spyOn(component.selectGroup, 'emit');
            component.onSelect({ name: 'groupname' });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(selectEmitSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should show an error message if the search result empty', (done) => {
            findGroupsByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('.adf-cloud-group-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain(' ADF_CLOUD_GROUPS.ERROR.NOT_FOUND ');
                done();
            });
        });
    });

    describe('when application name defined', () => {

        let checkGroupHasAnyClientAppRoleSpy: jasmine.Spy;
        let checkGroupHasClientAppSpy: jasmine.Spy;

        beforeEach(async(() => {
            findGroupsByNameSpy = spyOn(identityGroupService, 'findGroupsByName').and.returnValue(of(mockIdentityGroups));
            checkGroupHasAnyClientAppRoleSpy = spyOn(identityGroupService, 'checkGroupHasAnyClientAppRole').and.returnValue(of(true));
            checkGroupHasClientAppSpy = spyOn(identityGroupService, 'checkGroupHasClientApp').and.returnValue(of(true));
            component.preSelectGroups = [];
            component.appName = 'mock-app-name';
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should fetch the client ID if appName specified', async(() => {
            const getClientIdByApplicationNameSpy = spyOn(identityGroupService, 'getClientIdByApplicationName').and.callThrough();
            component.appName = 'mock-app-name';
            const change = new SimpleChange(null, 'mock-app-name', false);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();
            fixture.whenStable().then( () => {
                fixture.detectChanges();
                expect(getClientIdByApplicationNameSpy).toHaveBeenCalled();
            });
        }));

        it('should list groups who have access to the app when appName is specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(5);
                done();
            });
        });

        it('should not list groups who do not have access to the app when appName is specified', (done) => {
            checkGroupHasClientAppSpy.and.returnValue(of(false));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelectorAll('mat-option').length).toEqual(0);
                done();
            });
        });

        it('should list groups if given roles mapped with client roles', (done) => {
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(5);
                expect(checkGroupHasAnyClientAppRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not list groups if roles are not mapping with client roles', (done) => {
            checkGroupHasAnyClientAppRoleSpy.and.returnValue(of(false));
            component.roles = ['MOCK_ROLE_1', 'MOCK_ROLE_1'];
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(0);
                expect(checkGroupHasAnyClientAppRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not call client role mapping sevice if roles not specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkGroupHasAnyClientAppRoleSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should validate access to the app when appName is specified', (done) => {
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkGroupHasClientAppSpy).toHaveBeenCalledTimes(5);
                done();
            });
        });

        it('should not validate access to the app when appName is not specified', (done) => {
            component.appName = '';
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkGroupHasClientAppSpy).not.toHaveBeenCalled();
                done();
            });
        });

        it('should show an error message if the group does not have access', (done) => {
            checkGroupHasClientAppSpy.and.returnValue(of(false));
            findGroupsByNameSpy.and.returnValue(of([]));
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'ZZZ';
            inputHTMLElement.dispatchEvent(new Event('keyup'));
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                inputHTMLElement.blur();
                fixture.detectChanges();
                const errorMessage = element.querySelector('.adf-cloud-group-error-message');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain(' ADF_CLOUD_GROUPS.ERROR.NOT_FOUND ');
                done();
            });
        });
    });

    describe('Single Mode and Pre-selected groups', () => {

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectGroups = <any> mockIdentityGroups;
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should not show chip list when mode=single', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeNull();
                done();
            });
        });

        it('should not pre-select any group when preSelectGroups is empty and mode=single', (done) => {
            component.preSelectGroups = [];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const selectedGroup = component.searchGroupsControl.value;
                expect(selectedGroup).toBeNull();
                done();
            });
        });
    });

    describe('Multiple Mode and Pre-selected groups', () => {

        const change = new SimpleChange(null, mockIdentityGroups, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.preSelectGroups = <any> mockIdentityGroups;
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should show chip list when mode=multiple', (done) => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const chip = element.querySelector('mat-chip-list');
                expect(chip).toBeDefined();
                done();
            });
        });

        it('should pre-select all preSelectGroups when mode=multiple', (done) => {
            component.mode = 'multiple';
            fixture.detectChanges();
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                expect(chips.length).toBe(5);
                done();
            });
        });

        it('should emit removeGroup when a selected group is removed', (done) => {
            const removeSpy = spyOn(component.removeGroup, 'emit');
            component.mode = 'multiple';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
                removeIcon.nativeElement.click();
                fixture.detectChanges();
                expect(removeSpy).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('When roles defined', () => {

        let checkGroupHasRoleSpy: jasmine.Spy;

        beforeEach(async(() => {
            component.roles = ['mock-role-1', 'mock-role-2'];
            spyOn(identityGroupService, 'findGroupsByName').and.returnValue(of(mockIdentityGroups));
            checkGroupHasRoleSpy = spyOn(identityGroupService, 'checkGroupHasRole').and.returnValue(of(true));
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should filter if groups has any specified role', (done) => {
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(5);
                expect(checkGroupHasRoleSpy).toHaveBeenCalledTimes(5);
                done();
            });
        });

        it('should not filter groups if group does not have any specified role', (done) => {
            fixture.detectChanges();
            checkGroupHasRoleSpy.and.returnValue(of(false));
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelectorAll('mat-option').length).toEqual(0);
                expect(checkGroupHasRoleSpy).toHaveBeenCalled();
                done();
            });
        });

        it('should not call checkGroupHasRole service when roles are not specified', (done) => {
            component.roles = [];
            fixture.detectChanges();
            const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
            inputHTMLElement.focus();
            inputHTMLElement.value = 'M';
            inputHTMLElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(checkGroupHasRoleSpy).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('Single Mode and Pre-selected groups with readonly mode', () => {
        beforeEach(async( () => {
            component.preSelectGroups = [
                { id: mockIdentityGroups[0].id, name: mockIdentityGroups[0].name, readonly: true }
            ];
            component.mode = 'single';
            component.readOnly = true;
            fixture.detectChanges();
        }));

        it('should group input be disabled', () => {
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const groupInput = fixture.nativeElement.querySelector('[data-automation-id="adf-cloud-group-search-input"]');
                expect(groupInput.readOnly).toBeTruthy();
            });
        });
    });

    describe('Multiple Mode with read-only', () => {

        it('should group chip-list be disabled', () => {
            component.preSelectGroups = [
                { id: mockIdentityGroups[0].id, name: mockIdentityGroups[0].name },
                { id: mockIdentityGroups[1].id, name: mockIdentityGroups[1].name }
            ];
            component.mode = 'multiple';
            component.readOnly = true;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const matChipList = fixture.nativeElement.querySelector('mat-chip-list');
                expect(matChipList.attributes['ng-reflect-disabled'].value).toBeTruthy();
            });
        });

        it('Should not show remove icon for pre-selected groups if readonly property set to true', (done) => {
            fixture.detectChanges();
            component.preSelectGroups = [
                { id: mockIdentityGroups[0].id, name: mockIdentityGroups[0].name, readonly: true },
                { id: mockIdentityGroups[1].id, name: mockIdentityGroups[1].name, readonly: true }
            ];
            const change = new SimpleChange(null, component.preSelectGroups, false);
            component.mode = 'multiple';
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
            const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-cloud-group-chip-remove-icon-Mock Group 1"]');
            expect(chipList.length).toBe(2);
            expect(component.preSelectGroups[0].readonly).toBeTruthy();
            expect(component.preSelectGroups[1].readonly).toBeTruthy();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(removeIcon).toBeNull();
                expect(component.preSelectGroups.length).toBe(2);
                expect(component.preSelectGroups[0].readonly).toBe(true, 'Not removable');
                expect(component.preSelectGroups[1].readonly).toBe(true, 'Not removable');
                expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(2);
                done();
            });
        });

        it('Should be able to remove preselected groups if readonly property set to false', (done) => {
            fixture.detectChanges();
            component.preSelectGroups = [
                { id: mockIdentityGroups[0].id, name: mockIdentityGroups[0].name, readonly: false },
                { id: mockIdentityGroups[1].id, name: mockIdentityGroups[1].name, readonly: false }
            ];
            const change = new SimpleChange(null, component.preSelectGroups, false);
            component.mode = 'multiple';
            const removeGroupSpy = spyOn(component.removeGroup, 'emit');
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
            const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-cloud-group-chip-remove-icon-Mock Group 1"]');
            expect(chipList.length).toBe(2);
            expect(component.preSelectGroups[0].readonly).toBe(false, 'Removable');
            expect(component.preSelectGroups[1].readonly).toBe(false, 'Removable');
            removeIcon.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                removeIcon.click();
                fixture.detectChanges();
                expect(removeGroupSpy).toHaveBeenCalled();
                expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(1);
                done();
            });
        });
    });

    describe('Multiple Mode and Pre-selected groups with validate flag', () => {

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectGroups = <any> mockIdentityGroups;
            element = fixture.nativeElement;
            alfrescoApiService = TestBed.get(AlfrescoApiService);
            fixture.detectChanges();
        }));

        it('should emit warning if are invalid groups', (done) => {
            findGroupsByNameSpy.and.returnValue(Promise.resolve([]));
            const warnMessage = { message: 'INVALID_PRESELECTED_GROUPS', groups: [{ name: 'invalidGroupOne' }, { name: 'invalidGroupTwo' }] };
            component.validate = true;
            component.preSelectGroups = <any> [{ name: 'invalidGroupOne' }, { name: 'invalidGroupTwo' }];
            fixture.detectChanges();
            // component.loadSinglePreselectGroup();
            component.warning.subscribe((response) => {
                expect(response).toEqual(warnMessage);
                expect(response.message).toEqual(warnMessage.message);
                expect(response.groups).toEqual(warnMessage.groups);
                expect(response.groups[0].name).toEqual('invalidGroupOne');
                done();
            });
        });

        it('should filter group by name if validate true', (done) => {
            findGroupsByNameSpy.and.returnValue(of(mockIdentityGroups));
            component.mode = 'multiple';
            component.validate = true;
            component.preSelectGroups = <any> [{ name: mockIdentityGroups[1].name }, { name: mockIdentityGroups[2].name }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                // component.filterPreselectGroups().then((result) => {
                //     expect(findGroupsByNameSpy).toHaveBeenCalled();
                //     expect(component.groupExists(result[0])).toEqual(true);
                //     expect(component.groupExists(result[1])).toEqual(true);
                    done();
                // });
            });
        });

        it('should not preselect any group if name is invalid and validation enable', (done) => {
            findGroupsByNameSpy.and.returnValue(of([]));
            component.mode = 'single';
            component.validate = true;
            component.preSelectGroups = <any> [{ name: 'invalid group' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                component.validatePreselectGroups().then((result) => {
                    fixture.detectChanges();
                    expect(findGroupsByNameSpy).toHaveBeenCalled();
                    expect(result.length).toEqual(0);
                    done();
                });
            });
        });
    });
});
