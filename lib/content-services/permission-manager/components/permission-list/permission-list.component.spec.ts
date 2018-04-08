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
import { NodesApiService, SearchService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { NodePermissionService } from '../../services/node-permission.service';
import { fakeNodeWithPermissions,
         fakeNodeInheritedOnly,
         fakeNodeWithOnlyLocally,
         fakeSiteNodeResponse,
         fakeSiteRoles,
         fakeEmptyResponse } from '../../../mock/permission-list.component.mock';

describe('PermissionDisplayComponent', () => {

    let fixture: ComponentFixture<PermissionListComponent>;
    let component: PermissionListComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;
    let nodePermissionService: NodePermissionService;
    let searchApiService: SearchService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PermissionListComponent
            ],
            providers: [NodesApiService, NodePermissionService]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PermissionListComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            nodeService = TestBed.get(NodesApiService);
            nodePermissionService = TestBed.get(NodePermissionService);
            searchApiService = TestBed.get(SearchService);
        });
    }));

    afterEach(async(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    }));

    it('should be able to render the component', () => {
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
    });

    it('should show the node permissions', () => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithPermissions));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeEmptyResponse));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelectorAll('.adf-datatable-row').length).toBe(4);
    });

    it('should show inherited label for inherited permissions', () => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeInheritedOnly));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeEmptyResponse));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-inherited-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-inherited-label')).not.toBeNull();
    });

    describe('when it is a locally set permission', () => {

        it('should show locally set label for locally set permissions',  () => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
            spyOn(nodePermissionService, 'getGroupMemeberByGroupName').and.returnValue(Observable.of(fakeSiteRoles));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeSiteNodeResponse));
            fixture.detectChanges();
            expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
            expect(element.querySelector('#adf-permission-locallyset-label')).toBeDefined();
            expect(element.querySelector('#adf-permission-locallyset-label')).not.toBeNull();
        });

        it('should show a dropdown with the possible roles',  async(() => {
            component.nodeId = 'fake-node-id';
            spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
            spyOn(nodePermissionService, 'getGroupMemeberByGroupName').and.returnValue(Observable.of(fakeSiteRoles));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeSiteNodeResponse));
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
            spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeEmptyResponse));
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
            spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
            spyOn(nodeService, 'updateNode').and.returnValue(Observable.of({id: 'fake-updated-node'}));
            spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Promise.resolve(fakeEmptyResponse));
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
