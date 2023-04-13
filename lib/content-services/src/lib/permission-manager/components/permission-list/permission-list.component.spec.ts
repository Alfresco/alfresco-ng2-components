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

import { setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { SearchService } from '../../../search/services/search.service';
import { PermissionListComponent } from './permission-list.component';
import { NodePermissionService } from '../../services/node-permission.service';
import {
    fakeEmptyResponse,
    fakeNodeInheritedOnly,
    fakeNodeLocalSiteManager,
    fakeNodeWithOnlyLocally,
    fakeNodeWithoutPermissions,
    fakeNodeWithPermissions,
    fakeReadOnlyNodeInherited,
    fakeSiteNodeResponse,
    fakeSiteRoles
} from '../../../mock/permission-list.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { MinimalNode } from '@alfresco/js-api';
import { NodesApiService } from '../../../common/services/nodes-api.service';

describe('PermissionListComponent', () => {

    let fixture: ComponentFixture<PermissionListComponent>;
    let component: PermissionListComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;
    let nodePermissionService: NodePermissionService;
    let searchApiService: SearchService;
    let getNodeSpy: jasmine.Spy;
    let searchQuerySpy: jasmine.Spy;
    const fakeLocalPermission = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionListComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        nodeService = TestBed.inject(NodesApiService);
        nodePermissionService = TestBed.inject(NodePermissionService);
        searchApiService = TestBed.inject(SearchService);

        spyOn(nodePermissionService, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));
        getNodeSpy = spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithoutPermissions));
        searchQuerySpy = spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
        component.nodeId = 'fake-node-id';
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render default layout', async () => {
        component.nodeId = 'fake-node-id';
        getNodeSpy.and.returnValue(of(fakeNodeWithoutPermissions));
        component.ngOnInit();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('.adf-permission-container')).not.toBeNull();
        expect(element.querySelector('[data-automation-id="adf-locally-set-permission"]')).not.toBeNull();
    });

    it('should render error template', async () => {
        component.nodeId = 'fake-node-id';
        getNodeSpy.and.returnValue(throwError(null));
        component.ngOnInit();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('.adf-no-permission__template')).not.toBeNull();
        expect(element.querySelector('.adf-no-permission__template p').textContent).toContain('PERMISSION_MANAGER.ERROR.NOT-FOUND');
    });

    it('should show the node permissions', () => {
        component.nodeId = 'fake-node-id';
        getNodeSpy.and.returnValue(of(fakeNodeWithPermissions));
        component.ngOnInit();
        fixture.detectChanges();

        expect(element.querySelectorAll('[data-automation-id="adf-locally-set-permission"] .adf-datatable-row').length).toBe(2);

        const showButton = element.querySelector<HTMLButtonElement>('[data-automation-id="permission-info-button"]');
        showButton.click();
        fixture.detectChanges();

        expect(document.querySelectorAll('[data-automation-id="adf-inherited-permission"] .adf-datatable-row').length).toBe(3);
    });

    describe('Inherited Permission', () => {
        it('should show inherited details',  async () => {
            getNodeSpy.and.returnValue(of(fakeNodeInheritedOnly));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-inherit-container .mat-checked')).toBeDefined();
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON');
            expect(element.querySelector('span[title="total"]').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
        });

        it('should toggle the inherited button',  async () => {
            getNodeSpy.and.returnValue(of(fakeNodeInheritedOnly));
            component.ngOnInit();

            fixture.detectChanges();

            expect(element.querySelector('.adf-inherit-container .mat-checked')).toBeDefined();
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON');
            expect(element.querySelector('span[title="total"]').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');

            spyOn(nodeService, 'updateNode').and.returnValue(of(fakeLocalPermission));

            const slider = fixture.debugElement.query(By.css('mat-slide-toggle'));
            slider.triggerEventHandler('change', { source: { checked: false } });

            fixture.detectChanges();

            expect(element.querySelector('.adf-inherit-container .mat-checked')).toBe(null);
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.OFF');
            expect(element.querySelector('span[title="total"]').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
        });

        it('should not toggle inherited button for read only users',  async () => {
            getNodeSpy.and.returnValue(of(fakeReadOnlyNodeInherited));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-inherit-container .mat-checked')).toBeDefined();
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON');
            expect(element.querySelector('span[title="total"]').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');

            spyOn(nodeService, 'updateNode').and.returnValue(of(fakeLocalPermission));

            const slider = fixture.debugElement.query(By.css('mat-slide-toggle'));
            slider.triggerEventHandler('change', { source: { checked: false } });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('.adf-inherit-container .mat-checked')).toBeDefined();
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON');
            expect(element.querySelector('span[title="total"]').textContent.trim())
                .toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
            expect(document.querySelector('.adf-snackbar-message-content').textContent)
                .toContain('PERMISSION_MANAGER.ERROR.NOT-ALLOWED');
        });

    });

   describe('locally set permission', () => {
        beforeEach(() => {
            getNodeSpy.and.returnValue(of(fakeLocalPermission));
        });

        it('should show locally set permissions',  async () => {
            searchQuerySpy.and.returnValue(of(fakeSiteNodeResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');
        });

        it('should see the settable roles if the node is not in any site', async () => {
            searchQuerySpy.and.returnValue(of(fakeSiteNodeResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');

            const selectBox = fixture.debugElement.query(By.css(('[id="adf-select-role-permission"] .mat-select-trigger')));
            selectBox.triggerEventHandler('click', null);
            fixture.detectChanges();

            const options = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(options).not.toBeNull();
            expect(options.length).toBe(4);
            expect(options[0].nativeElement.innerText).toContain('ADF.ROLES.SITECOLLABORATOR');
            expect(options[1].nativeElement.innerText).toContain('ADF.ROLES.SITECONSUMER');
            expect(options[2].nativeElement.innerText).toContain('ADF.ROLES.SITECONTRIBUTOR');
            expect(options[3].nativeElement.innerText).toContain('ADF.ROLES.SITEMANAGER');
        });

        it('should show readonly member for site manager to toggle the inherit permission', async () => {
            getNodeSpy.and.returnValue(of(fakeNodeLocalSiteManager));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_site_testsite_SiteManager');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('ADF.ROLES.SITEMANAGER');
            const deleteButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-delete-permission-button-GROUP_site_testsite_SiteManager"]');
            expect(deleteButton.disabled).toBe(true);
            const otherDeleteButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-delete-permission-button-superadminuser"]');
            expect(otherDeleteButton.disabled).toBe(false);
        });

        it('should update the role when another value is chosen',  async () => {
            spyOn(nodeService, 'updateNode').and.returnValue(of(new MinimalNode({id: 'fake-uwpdated-node'})));
            searchQuerySpy.and.returnValue(of(fakeEmptyResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');

            const selectBox = fixture.debugElement.query(By.css(('[id="adf-select-role-permission"] .mat-select-trigger')));
            selectBox.triggerEventHandler('click', null);
            fixture.detectChanges();
            const options = fixture.debugElement.queryAll(By.css('mat-option'));
            expect(options).not.toBeNull();
            expect(options.length).toBe(5);
            options[3].triggerEventHandler('click', {});
            fixture.detectChanges();
            expect(nodeService.updateNode).toHaveBeenCalledWith('f472543f-7218-403d-917b-7a5861257244', { permissions: { locallySet: [ { accessStatus: 'ALLOWED', name: 'Editor', authorityId: 'GROUP_EVERYONE' } ] } });
        });

        it('should delete the person',  async () => {
            spyOn(nodeService, 'updateNode').and.returnValue(of(new MinimalNode({id: 'fake-uwpdated-node'})));
            searchQuerySpy.and.returnValue(of(fakeEmptyResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');

            const deleteButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-delete-permission-button-GROUP_EVERYONE"]');
            deleteButton.click();
            fixture.detectChanges();

            expect(nodeService.updateNode).toHaveBeenCalledWith('f472543f-7218-403d-917b-7a5861257244', { permissions: { locallySet: [ ] } });
        });

    });
});
