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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionListComponent } from './permission-list.component';
import { By } from '@angular/platform-browser';
import { NodesApiService, SearchService, setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { NodePermissionService } from '../../services/node-permission.service';
import { fakeNodeWithPermissions,
         fakeNodeInheritedOnly,
         fakeNodeWithOnlyLocally,
         fakeSiteNodeResponse,
         fakeSiteRoles,
         fakeNodeWithoutPermissions,
         fakeEmptyResponse } from '../../../mock/permission-list.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('PermissionDisplayComponent', () => {

    let fixture: ComponentFixture<PermissionListComponent>;
    let component: PermissionListComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;
    let nodePermissionService: NodePermissionService;
    let searchApiService: SearchService;

    setupTestBed({
        imports: [ContentTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionListComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        nodeService = TestBed.get(NodesApiService);
        nodePermissionService = TestBed.get(NodePermissionService);
        searchApiService = TestBed.get(SearchService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to render the component', () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithOnlyLocally));
        spyOn(nodePermissionService, 'getNodeRoles').and.returnValue(of([]));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
    });

    it('should render default empty template when no permissions', () => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithoutPermissions));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
        fixture.detectChanges();

        expect(element.querySelector('#adf-no-permissions-template')).not.toBeNull();
        expect(element.querySelector('#adf-permission-display-container .adf-datatable-permission')).toBeNull();
    });

    it('should show the node permissions', () => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithPermissions));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelectorAll('.adf-datatable-row').length).toBe(4);
    });

    it('should show inherited label for inherited permissions', () => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeInheritedOnly));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-inherited-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-inherited-label')).not.toBeNull();
    });

    describe('when it is a locally set permission', () => {

        it('should show locally set label for locally set permissions',  () => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithOnlyLocally));
            spyOn(nodePermissionService, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
            fixture.detectChanges();
            expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
            expect(element.querySelector('#adf-permission-locallyset-label')).toBeDefined();
            expect(element.querySelector('#adf-permission-locallyset-label')).not.toBeNull();
        });

        it('should show a dropdown with the possible roles',  async(() => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithOnlyLocally));
            spyOn(nodePermissionService, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#adf-select-role-permission')).toBeDefined();
                expect(element.querySelector('#adf-select-role-permission')).not.toBeNull();
                const selectBox = fixture.debugElement.query(By.css(('#adf-select-role-permission .mat-select-trigger')));
                selectBox.triggerEventHandler('click', null);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let options: any = fixture.debugElement.queryAll(By.css('mat-option'));
                    expect(options).not.toBeNull();
                    expect(options.length).toBe(4);
                    expect(options[0].nativeElement.innerText).toContain('SiteCollaborator');
                    expect(options[1].nativeElement.innerText).toContain('SiteConsumer');
                    expect(options[2].nativeElement.innerText).toContain('SiteContributor');
                    expect(options[3].nativeElement.innerText).toContain('SiteManager');
                });
            });
        }));

        it('should show the settable roles if the node is not in any site',  async(() => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithOnlyLocally));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#adf-select-role-permission')).toBeDefined();
                expect(element.querySelector('#adf-select-role-permission')).not.toBeNull();
                const selectBox = fixture.debugElement.query(By.css(('#adf-select-role-permission .mat-select-trigger')));
                selectBox.triggerEventHandler('click', null);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let options: any = fixture.debugElement.queryAll(By.css('mat-option'));
                    expect(options).not.toBeNull();
                    expect(options.length).toBe(5);
                    expect(options[0].nativeElement.innerText).toContain('Contributor');
                    expect(options[1].nativeElement.innerText).toContain('Collaborator');
                    expect(options[2].nativeElement.innerText).toContain('Coordinator');
                    expect(options[3].nativeElement.innerText).toContain('Editor');
                    expect(options[4].nativeElement.innerText).toContain('Consumer');
                });
            });
        }));

        it('should update the role when another value is chosen',  async(() => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithOnlyLocally));
            spyOn(nodeService, 'updateNode').and.returnValue(of({id: 'fake-updated-node'}));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));
            component.update.subscribe((updatedPermission) => {
                expect(updatedPermission).not.toBeNull();
                expect(updatedPermission.name).toBe('Editor');
                expect(updatedPermission.authorityId).toBe('GROUP_EVERYONE');
                expect(updatedPermission.accessStatus).toBe('ALLOWED');
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#adf-select-role-permission')).toBeDefined();
                expect(element.querySelector('#adf-select-role-permission')).not.toBeNull();
                const selectBox = fixture.debugElement.query(By.css(('#adf-select-role-permission .mat-select-trigger')));
                selectBox.triggerEventHandler('click', null);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let options: any = fixture.debugElement.queryAll(By.css('mat-option'));
                    expect(options).not.toBeNull();
                    expect(options.length).toBe(5);
                    options[3].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    expect(nodeService.updateNode).toHaveBeenCalled();
                });
            });
        }));

    });

});
