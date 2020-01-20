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

describe('GroupCloudComponent', () => {
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
        fixture.whenStable().then(() => {
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

        it('should list the groups as dropdown options if the search term has results', (done) => {
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

        it('should selectedGroup  and groupsChanged emit, update selected groups when a group is selected', (done) => {
            const group = { name: 'groupname' };
            fixture.detectChanges();
            spyOn(component, 'hasGroupIdOrName').and.returnValue(true);
            const selectEmitSpy = spyOn(component.selectGroup, 'emit');
            const changedGroupsSpy = spyOn(component.changedGroups, 'emit');
            component.onSelect(group);
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(selectEmitSpy).toHaveBeenCalledWith(group);
                expect(changedGroupsSpy).toHaveBeenCalledWith([group]);
                expect(component.getSelectedGroups()[0]).toEqual(group);
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
                const errorMessage = element.querySelector('[data-automation-id="invalid-groups-typing-error"]');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUND');
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

        it('should fetch the client ID if appName specified', async (() => {
            const getClientIdByApplicationNameSpy = spyOn(identityGroupService, 'getClientIdByApplicationName').and.callThrough();
            component.appName = 'mock-app-name';
            const change = new SimpleChange(null, 'mock-app-name', false);
            component.ngOnChanges({ 'appName': change });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
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
                const errorMessage = element.querySelector('[data-automation-id="invalid-groups-typing-error"]');
                expect(errorMessage).not.toBeNull();
                expect(errorMessage.textContent).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUND');
                done();
            });
        });
    });

    describe('No preselected groups', () => {
        beforeEach(async () => {
            fixture.detectChanges();
        });

        it('should not pre-select any group when preSelectGroups is empty - single mode', () => {
            component.mode = 'single';
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(0);
        });

        it('should not pre-select any group when preSelectGroups is empty - multiple mode', () => {
            component.mode = 'multiple';
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(0);
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

    describe('Single Mode with pre-selected groups', () => {

        const changes = new SimpleChange(null, mockIdentityGroups, false);

        beforeEach(async(() => {
            component.mode = 'single';
            component.preSelectGroups = <any> mockIdentityGroups;
            component.ngOnChanges({ 'preSelectGroups': changes });
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should show only one mat chip with the first preSelectedGroup', () => {
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toEqual(1);
            expect(chips[0].attributes['data-automation-id']).toEqual(`adf-cloud-group-chip-${mockIdentityGroups[0].name}`);
        });
    });

    describe('Multiple Mode with pre-selected groups', () => {

        const change = new SimpleChange(null, mockIdentityGroups, false);

        beforeEach(async(() => {
            component.mode = 'multiple';
            component.preSelectGroups = <any> mockIdentityGroups;
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            element = fixture.nativeElement;
        }));

        it('should pre-select all preSelectGroups', () => {
            component.mode = 'multiple';
            fixture.detectChanges();
            component.ngOnChanges({ 'preSelectGroups': change });
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(5);
        });

        it('should removeGroup and changedGroups emit when a selected group is removed', (done) => {
            const removeGroupEmitterSpy = spyOn(component.removeGroup, 'emit');
            const changedGroupsEmitterSpy = spyOn(component.changedGroups, 'emit');
            const groupToRemove = mockIdentityGroups[0];
            component.mode = 'multiple';
            fixture.detectChanges();

            const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
            removeIcon.nativeElement.click();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(removeGroupEmitterSpy).toHaveBeenCalledWith(groupToRemove);
                expect(changedGroupsEmitterSpy).toHaveBeenCalledWith([mockIdentityGroups[1], mockIdentityGroups[2], mockIdentityGroups[3], mockIdentityGroups[4]]);
                expect(component.getSelectedGroups().indexOf({
                    id: groupToRemove.id,
                    name: groupToRemove.name,
                    path: groupToRemove.path
                })).toEqual(-1);
                done();
            });
        });

    });

    describe('Multiple Mode with read-only', () => {

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
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chipList = fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip');
                const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-cloud-group-chip-remove-icon-Mock Group 1"]');
                expect(chipList.length).toBe(2);
                expect(component.preSelectGroups[0].readonly).toBeTruthy();
                expect(component.preSelectGroups[1].readonly).toBeTruthy();
                expect(removeIcon).toBeNull();
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
            component.ngOnChanges({ 'preSelectGroups': change });
            const removeGroupSpy = spyOn(component.removeGroup, 'emit');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const removeIcon = <HTMLElement> fixture.nativeElement.querySelector('[data-automation-id="adf-cloud-group-chip-remove-icon-Mock Group 1"]');
                expect(chips.length).toBe(2);
                expect(component.preSelectGroups[0].readonly).toBe(false, 'Removable');
                expect(component.preSelectGroups[1].readonly).toBe(false, 'Removable');
                removeIcon.click();
                fixture.detectChanges();
                expect(removeGroupSpy).toHaveBeenCalled();
                expect(fixture.nativeElement.querySelectorAll('mat-chip-list mat-chip').length).toBe(1);
                done();
            });
        });

        describe('Component readonly mode', () => {
            const change = new SimpleChange(null, mockIdentityGroups, false);

            it('should chip list be disabled and show one single chip - single mode', () => {
                component.mode = 'single';
                component.readOnly = true;
                component.preSelectGroups = <any> mockIdentityGroups;
                component.ngOnChanges({ 'preSelectGroups': change });

                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const chipList = fixture.nativeElement.querySelector('mat-chip-list');
                expect(chips).toBeDefined();
                expect(chipList).toBeDefined();
                expect(chips.length).toBe(1);
                expect(chipList.attributes['ng-reflect-disabled'].value).toEqual('true');
            });

            it('should chip list be disabled and show all the chips - multiple mode', () => {
                component.mode = 'multiple';
                component.readOnly = true;
                component.preSelectGroups = <any> mockIdentityGroups;
                component.ngOnChanges({ 'preSelectGroups': change });
                fixture.detectChanges();
                const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
                const chipList = fixture.nativeElement.querySelector('mat-chip-list');
                expect(chips).toBeDefined();
                expect(chipList).toBeDefined();
                expect(chips.length).toBe(5);
                expect(chipList.attributes['ng-reflect-disabled'].value).toEqual('true');
            });
        });

        describe('Preselected groups and validation enabled', () => {

            it('should check validation only for the first group and emit warning when group is invalid - single mode', (done) => {
                spyOn(identityGroupService, 'findGroupsByName').and.returnValue(Promise.resolve([]));
                spyOn(component, 'hasGroupIdOrName').and.returnValue(false);

                const expectedWarning = {
                    message: 'INVALID_PRESELECTED_GROUPS',
                    groups: [{
                        id: mockIdentityGroups[0].id,
                        name: mockIdentityGroups[0].name,
                        path: mockIdentityGroups[0].path,
                        subGroups: []
                    }]
                };
                component.warning.subscribe(warning => {
                    expect(warning).toEqual(expectedWarning);
                    done();
                });

                component.mode = 'single';
                component.validate = true;
                component.preSelectGroups = <any> [mockIdentityGroups[0], mockIdentityGroups[1]];
                component.ngOnChanges({ 'preSelectGroups': new SimpleChange(null, [mockIdentityGroups[0], mockIdentityGroups[1]], false) });
            });

            it('should check validation for all the groups and emit warning - multiple mode', (done) => {
                spyOn(identityGroupService, 'findGroupsByName').and.returnValue(Promise.resolve(undefined));

                const expectedWarning = {
                    message: 'INVALID_PRESELECTED_GROUPS',
                    groups: [
                        {
                            id: mockIdentityGroups[0].id,
                            name: mockIdentityGroups[0].name,
                            path: mockIdentityGroups[0].path,
                            subGroups: []
                        },
                        {
                            id: mockIdentityGroups[1].id,
                            name: mockIdentityGroups[1].name,
                            path: mockIdentityGroups[1].path,
                            subGroups: []
                        }]
                };

                component.warning.subscribe(warning => {
                    expect(warning).toEqual(expectedWarning);
                    done();
                });

                component.mode = 'multiple';
                component.validate = true;
                component.preSelectGroups = <any> [mockIdentityGroups[0], mockIdentityGroups[1]];
                component.ngOnChanges({ 'preSelectGroups': new SimpleChange(null, [mockIdentityGroups[0], mockIdentityGroups[1]], false) });
            });
        });

        it('should removeDuplicatedGroups return only unique groups', () => {
            const duplicatedGroups = [{ name: mockIdentityGroups[0].name }, { name: mockIdentityGroups[0].name }];
            expect(component.removeDuplicatedGroups(duplicatedGroups)).toEqual([{ name: mockIdentityGroups[0].name }]);
        });
    });
});
