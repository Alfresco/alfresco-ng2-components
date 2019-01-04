/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

describe('GroupCloudComponent', () => {
    let component: GroupCloudComponent;
    let fixture: ComponentFixture<GroupCloudComponent>;
    let element: HTMLElement;
    let service: GroupCloudService;
    let getClientIdSpy: jasmine.Spy;
    let checkGroupHasClientRoleMappingSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, GroupCloudModule],
        providers: [AlfrescoApiServiceMock, GroupCloudService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupCloudComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        service = TestBed.get(GroupCloudService);
        spyOn(service, 'findGroupsByName').and.returnValue(mockGroups);
        getClientIdSpy = spyOn(service, 'getClientId').and.returnValue(Promise.resolve('mock-client-id'));
        checkGroupHasClientRoleMappingSpy = spyOn(service, 'checkGroupHasClientRoleMapping').and.returnValue(of(true));
        component.applicationName = 'mock-name';
    });

    it('should create GroupCloudComponent', () => {
        expect(component instanceof GroupCloudComponent).toBeTruthy();
    });

    it('should be able to fetch client id', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getClientIdSpy).toHaveBeenCalled();
            expect(component.applicationId).toBe('mock-client-id');
        });
    }));

    it('should show the groups if the typed result match', async(() => {
        fixture.detectChanges();
        component.searchGroups$ = of(<GroupModel[]> mockGroups);
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
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
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
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
        let selectEmitSpy = spyOn(component.selectGroup, 'emit');
        component.onSelect(new GroupModel({ name: 'group name'}));
        fixture.whenStable().then(() => {
            expect(selectEmitSpy).toHaveBeenCalled();
        });
    }));

    it('should show an error message if the group is invalid', async(() => {
        fixture.detectChanges();
        checkGroupHasClientRoleMappingSpy.and.returnValue(of(false));
        fixture.detectChanges();
        let inputHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('input');
        inputHTMLElement.focus();
        inputHTMLElement.dispatchEvent(new Event('input'));
        inputHTMLElement.dispatchEvent(new Event('keyup'));
        inputHTMLElement.dispatchEvent(new Event('keydown'));
        inputHTMLElement.value = 'ZZZ';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const errorMessage = element.querySelector('.adf-cloud-group-error-message');
            expect(element.querySelector('.adf-cloud-group-error')).not.toBeNull();
            expect(errorMessage.textContent.trim()).toContain('ADF_CLOUD_GROUPS.ERROR.NOT_FOUND');
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
            const selectedUser = component.searchGroupsControl.value;
            expect(selectedUser.id).toBe(mockGroups[1].id);
        });
    }));

    it('should not pre-select any group when preSelectGroups is empty and mode=single', async(() => {
        component.mode = 'single';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const selectedUser = component.searchGroupsControl.value;
            expect(selectedUser).toBeNull();
        });
    }));

    it('should emit removeGroup when a selected group is removed if mode=multiple', async(() => {
        fixture.detectChanges();
        let removeUserSpy = spyOn(component.removeGroup, 'emit');
        component.onRemove(new GroupModel({ name: 'group name'}));
        fixture.whenStable().then(() => {
            expect(removeUserSpy).toHaveBeenCalled();
        });
    }));
});
