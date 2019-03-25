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
import { GroupCloudService } from '../services/group-cloud.service';
import { setupTestBed, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { mockGroups } from '../mock/group-cloud.mock';
import { GroupModel } from '../models/group.model';
import { SimpleChange } from '@angular/core';

describe('GroupCloudComponent', () => {
    let component: GroupCloudComponent;
    let fixture: ComponentFixture<GroupCloudComponent>;
    let element: HTMLElement;
    let service: GroupCloudService;
    let findGroupsByNameSpy: jasmine.Spy;
    let getClientIdByApplicationNameSpy: jasmine.Spy;
    let checkGroupHasAccessSpy: jasmine.Spy;
    let checkGroupHasGivenRoleSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, GroupCloudModule],
        providers: [AlfrescoApiServiceMock, GroupCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        service = TestBed.get(GroupCloudService);
        findGroupsByNameSpy = spyOn(service, 'findGroupsByName').and.returnValue(of(mockGroups));
        getClientIdByApplicationNameSpy = spyOn(service, 'getClientIdByApplicationName').and.returnValue(of('mock-client-id'));
        checkGroupHasAccessSpy = spyOn(service, 'checkGroupHasClientApp').and.returnValue(of(true));
        checkGroupHasGivenRoleSpy = spyOn(service, 'checkGroupHasRole').and.returnValue(of(true));
        component.appName = 'mock-app-name';
    });

    it('should create GroupCloudComponent', () => {
        expect(component instanceof GroupCloudComponent).toBeTruthy();
    });

    it('should be able to fetch client id', async(() => {
        component.ngOnChanges( {
            appName: new SimpleChange(null, component.appName, true)
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getClientIdByApplicationNameSpy).toHaveBeenCalled();
            expect(component.clientId).toBe('mock-client-id');
        });
    }));

    it('should show the groups if the typed result match', async(() => {
        fixture.detectChanges();
        component.searchGroups$ = of(<GroupModel[]> mockGroups);
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.dispatchEvent(new Event('input'));
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('keydown'));
        inputHTMLElement.value = 'M';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('mat-option'))).toBeDefined();
        });
    }));

    it('should hide result list if input is empty', async(() => {
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = '';
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.query(By.css('mat-option'))).toBeNull();
            expect(fixture.debugElement.query(By.css('#adf-group-0'))).toBeNull();
        });
    }));

    it('should emit selectedGroup if option is valid', async(() => {
        fixture.detectChanges();
        const selectEmitSpy = spyOn(component.selectGroup, 'emit');
        component.onSelect(new GroupModel({ name: 'group name'}));
        fixture.whenStable().then(() => {
            expect(selectEmitSpy).toHaveBeenCalled();
        });
    }));

    it('should show an error message if the group is invalid', async(() => {
        fixture.detectChanges();
        checkGroupHasAccessSpy.and.returnValue(of(false));
        findGroupsByNameSpy.and.returnValue(of([]));
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'ZZZ';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const errorMessage = element.querySelector('.adf-cloud-group-error-message');
            expect(errorMessage).not.toBeNull();
            expect(errorMessage.textContent).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUN');
        });
    }));

    it('should show chip list when mode=multiple', async(() => {
        component.mode = 'multiple';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const chip = element.querySelector('mat-chip-list');
            expect(chip).toBeDefined();
        });
    }));

    it('should not show chip list when mode=single', async(() => {
        component.mode = 'single';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const chip = element.querySelector('mat-chip-list');
            expect(chip).toBeNull();
        });
    }));

    it('should pre-select all preSelectGroups when mode=multiple', async(() => {
        component.mode = 'multiple';
        component.preSelectGroups = <any> [{id: mockGroups[1].id}, {id: mockGroups[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
            expect(chips.length).toBe(2);
        });
    }));

    it('should not pre-select any group when preSelectGroups is empty and mode=multiple', async(() => {
        component.mode = 'multiple';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const chip = fixture.debugElement.query(By.css('mat-chip'));
            expect(chip).toBeNull();
        });
    }));

    it('should pre-select preSelectGroups[0] when mode=single', async(() => {
        component.mode = 'single';
        component.preSelectGroups = <any> [{id: mockGroups[1].id}, {id: mockGroups[2].id}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedGroup = component.searchGroupsControl.value;
            expect(selectedGroup.id).toBe(mockGroups[1].id);
        });
    }));

    it('should not pre-select any group when preSelectGroups is empty and mode=single', async(() => {
        component.mode = 'single';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedGroup = component.searchGroupsControl.value;
            expect(selectedGroup).toBeNull();
        });
    }));

    it('should emit removeGroup when a selected group is removed if mode=multiple', async(() => {
        const removeGroupSpy = spyOn(component.removeGroup, 'emit');

        component.mode = 'multiple';
        component.preSelectGroups = <any> [{id: mockGroups[1].id}, {id: mockGroups[2].id}];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const removeIcon = fixture.debugElement.query(By.css('mat-chip mat-icon'));
            removeIcon.nativeElement.click();

            expect(removeGroupSpy).toHaveBeenCalledWith({ id: mockGroups[1].id });
        });

    }));

    it('should list groups who have access to the app when appName is specified', async(() => {
        component.appName = 'sample-app';
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const groupsList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(groupsList.length).toBe(mockGroups.length);
        });
    }));

    it('should not list groups who do not have access to the app when appName is specified', async(() => {
        checkGroupHasAccessSpy.and.returnValue(of(false));
        component.appName = 'sample-app';

        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('[data-automation-id="adf-cloud-group-search-input"]');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'Mock';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const groupsList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(groupsList.length).toBe(0);
        });
    }));

    it('should filter groups when roles are specified', async(() => {
        checkGroupHasGivenRoleSpy.and.returnValue(of(true));
        component.roles = ['mock-role-1', 'mock-role-2'];
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const groupsList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(groupsList.length).toBe(mockGroups.length);
            expect(checkGroupHasGivenRoleSpy).toHaveBeenCalled();
        });
    }));

    it('should return groups when roles are not specified', async(() => {
        checkGroupHasGivenRoleSpy.and.returnValue(of(false));
        component.roles = [];
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const groupsList = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(groupsList.length).toBe(mockGroups.length);
            expect(checkGroupHasGivenRoleSpy).not.toHaveBeenCalled();
        });
    }));

    it('should validate access to the app when appName is specified', async(() => {
        findGroupsByNameSpy.and.returnValue(of(mockGroups));
        checkGroupHasAccessSpy.and.returnValue(of(true));
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'Mock';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkGroupHasAccessSpy).toHaveBeenCalledTimes(mockGroups.length);
        });
    }));

    it('should not validate access to the app when appName is not specified', async(() => {
        fixture.detectChanges();
        const inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.value = 'M';
        inputHTMLElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(checkGroupHasAccessSpy).not.toHaveBeenCalled();
        });
    }));

    it('should load the clients if appName change', async( () => {
        component.appName = 'ADF';
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(getClientIdByApplicationNameSpy).toHaveBeenCalled();
        });
    }));

    it('should filter users if appName change', async(() => {
        component.appName = 'ADF';
        fixture.detectChanges();
        fixture.whenStable().then( () => {
            fixture.detectChanges();
            expect(checkGroupHasAccessSpy).toHaveBeenCalled();
        });
    }));
});
