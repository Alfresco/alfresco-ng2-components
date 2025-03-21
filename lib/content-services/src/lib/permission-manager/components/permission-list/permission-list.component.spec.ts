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
import { of, Subject, throwError } from 'rxjs';
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
import { Node } from '@alfresco/js-api';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { By } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ContentService } from '../../../common/services/content.service';
import { AllowableOperationsEnum, NodePermissionsModel, PermissionContainerComponent } from '@alfresco/adf-content-services';
import { DebugElement } from '@angular/core';

describe('PermissionListComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<PermissionListComponent>;
    let component: PermissionListComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;
    let nodePermissionService: NodePermissionService;
    let searchApiService: SearchService;
    let contentService: ContentService;
    let getNodeSpy: jasmine.Spy;
    let searchQuerySpy: jasmine.Spy;

    const fakeLocalPermission = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(PermissionListComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        nodeService = TestBed.inject(NodesApiService);
        nodePermissionService = TestBed.inject(NodePermissionService);
        searchApiService = TestBed.inject(SearchService);
        contentService = TestBed.inject(ContentService);

        spyOn(nodePermissionService, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));
        getNodeSpy = spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithoutPermissions));
        searchQuerySpy = spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
        component.nodeId = 'fake-node-id';
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
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
        it('should show inherited details', async () => {
            getNodeSpy.and.returnValue(of(fakeNodeInheritedOnly));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            const toggle = await loader.getHarness(MatSlideToggleHarness);
            expect(await toggle.isChecked()).toBe(true);

            expect(element.querySelector('.adf-inherit-container h3').textContent.trim()).toBe(
                'PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON'
            );
            expect(element.querySelector('span[title="total"]').textContent.trim()).toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
        });

        it('should toggle the inherited button', async () => {
            getNodeSpy.and.returnValue(of(fakeNodeInheritedOnly));
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
            component.ngOnInit();
            fixture.detectChanges();

            const toggle = await loader.getHarness(MatSlideToggleHarness);
            expect(await toggle.isChecked()).toBe(true);

            expect(element.querySelector('.adf-inherit-container h3').textContent.trim()).toBe(
                'PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON'
            );
            expect(element.querySelector('span[title="total"]').textContent.trim()).toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
            expect(contentService.hasAllowableOperations).toHaveBeenCalledWith(fakeNodeInheritedOnly, AllowableOperationsEnum.UPDATEPERMISSIONS);

            spyOn(nodeService, 'updateNode').and.returnValue(of(fakeLocalPermission));

            await toggle.uncheck();

            expect(element.querySelector('.adf-inherit-container h3').textContent.trim()).toBe(
                'PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.OFF'
            );
            expect(element.querySelector('span[title="total"]').textContent.trim()).toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
        });

        it('should not toggle inherited button for read only users', async () => {
            getNodeSpy.and.returnValue(of(fakeReadOnlyNodeInherited));
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(false);
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.directive(MatSlideToggle))).toBeNull();
            expect(element.querySelector('.adf-inherit-container h3').textContent.trim()).toBe(
                'PERMISSION_MANAGER.LABELS.INHERITED-PERMISSIONS PERMISSION_MANAGER.LABELS.ON'
            );
            expect(element.querySelector('span[title="total"]').textContent.trim()).toBe('PERMISSION_MANAGER.LABELS.INHERITED-SUBTITLE');
            expect(contentService.hasAllowableOperations).toHaveBeenCalledWith(fakeReadOnlyNodeInherited, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });
    });

    describe('locally set permission', () => {
        beforeEach(() => {
            getNodeSpy.and.returnValue(of(fakeLocalPermission));
        });

        it('should show locally set permissions', async () => {
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

            const select = await loader.getHarness(MatSelectHarness.with({ ancestor: `#adf-select-role-permission` }));
            await select.open();

            const options = await select.getOptions();
            expect(options.length).toBe(4);

            expect(await options[0].getText()).toContain('ADF.ROLES.SITECOLLABORATOR');
            expect(await options[1].getText()).toContain('ADF.ROLES.SITECONSUMER');
            expect(await options[2].getText()).toContain('ADF.ROLES.SITECONTRIBUTOR');
            expect(await options[3].getText()).toContain('ADF.ROLES.SITEMANAGER');
        });

        it('should show readonly member for site manager to toggle the inherit permission', async () => {
            getNodeSpy.and.returnValue(of(fakeNodeLocalSiteManager));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_site_testsite_SiteManager');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('ADF.ROLES.SITEMANAGER');
            const deleteButton = element.querySelector<HTMLButtonElement>(
                '[data-automation-id="adf-delete-permission-button-GROUP_site_testsite_SiteManager"]'
            );
            expect(deleteButton.disabled).toBe(true);
            const otherDeleteButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-delete-permission-button-superadminuser"]');
            expect(otherDeleteButton.disabled).toBe(false);
        });

        it('should update the role when another value is chosen', async () => {
            spyOn(nodeService, 'updateNode').and.returnValue(of(new Node({ id: 'fake-uwpdated-node' })));
            searchQuerySpy.and.returnValue(of(fakeEmptyResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');

            const select = await loader.getHarness(MatSelectHarness.with({ ancestor: `#adf-select-role-permission` }));
            await select.open();

            const options = await select.getOptions();
            expect(options.length).toBe(5);
            await options[3].click();
            expect(nodeService.updateNode).toHaveBeenCalledWith('f472543f-7218-403d-917b-7a5861257244', {
                permissions: { locallySet: [{ accessStatus: 'ALLOWED', name: 'Editor', authorityId: 'GROUP_EVERYONE' }] }
            });
        });

        it('should delete the person', async () => {
            spyOn(nodeService, 'updateNode').and.returnValue(of(new Node({ id: 'fake-uwpdated-node' })));
            searchQuerySpy.and.returnValue(of(fakeEmptyResponse));
            component.ngOnInit();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
            expect(element.querySelector('#adf-select-role-permission').textContent).toContain('Contributor');

            const deleteButton = element.querySelector<HTMLButtonElement>('[data-automation-id="adf-delete-permission-button-GROUP_EVERYONE"]');
            deleteButton.click();
            fixture.detectChanges();

            expect(nodeService.updateNode).toHaveBeenCalledWith('f472543f-7218-403d-917b-7a5861257244', { permissions: { locallySet: [] } });
        });
    });

    describe('Permission container', () => {
        let data$: Subject<NodePermissionsModel>;
        let hasAllowableOperationsSpy: jasmine.Spy<(node: Node, allowableOperation: AllowableOperationsEnum | string) => boolean>;

        const getPermissionContainerComponent = (): PermissionContainerComponent =>
            fixture.debugElement.query(By.directive(PermissionContainerComponent)).componentInstance;

        beforeEach(() => {
            data$ = new Subject<NodePermissionsModel>();
            component.permissionList.data$ = data$;
            hasAllowableOperationsSpy = spyOn(TestBed.inject(ContentService), 'hasAllowableOperations');
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should have assigned isReadOnly to false if updating of permissions is allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(true);
            data$.next({
                node: fakeNodeWithPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getPermissionContainerComponent().isReadOnly).toBe(false);
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });

        it('should have assigned isReadOnly to true if updating of permissions is not allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(false);
            data$.next({
                node: fakeNodeWithoutPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getPermissionContainerComponent().isReadOnly).toBe(true);
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithoutPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });
    });

    describe('Toolbar actions', () => {
        let data$: Subject<NodePermissionsModel>;
        let hasAllowableOperationsSpy: jasmine.Spy<(node: Node, allowableOperation: AllowableOperationsEnum | string) => boolean>;

        const getAddPermissionButton = (): DebugElement => fixture.debugElement.query(By.css('[data-automation-id="adf-add-permission-button"]'));

        const getDeletePermissionButton = (): DebugElement =>
            fixture.debugElement.query(By.css('[data-automation-id="adf-delete-selected-permission"]'));

        beforeEach(() => {
            data$ = new Subject<NodePermissionsModel>();
            component.permissionList.data$ = data$;
            hasAllowableOperationsSpy = spyOn(TestBed.inject(ContentService), 'hasAllowableOperations');
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should display add permission button if updating of permissions is allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(true);
            data$.next({
                node: fakeNodeWithPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getAddPermissionButton()).not.toBeNull();
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });

        it('should not display add permission button if updating of permissions is not allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(false);
            data$.next({
                node: fakeNodeWithoutPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getAddPermissionButton()).toBeNull();
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithoutPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });

        it('should display delete permission button if updating of permissions is allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(true);
            data$.next({
                node: fakeNodeWithPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getDeletePermissionButton()).not.toBeNull();
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });

        it('should not display delete permission button if updating of permissions is not allowed', () => {
            hasAllowableOperationsSpy.and.returnValue(false);
            data$.next({
                node: fakeNodeWithoutPermissions,
                inheritedPermissions: [],
                localPermissions: []
            } as NodePermissionsModel);
            fixture.detectChanges();

            expect(getDeletePermissionButton()).toBeNull();
            expect(hasAllowableOperationsSpy).toHaveBeenCalledWith(fakeNodeWithoutPermissions, AllowableOperationsEnum.UPDATEPERMISSIONS);
        });
    });
});
