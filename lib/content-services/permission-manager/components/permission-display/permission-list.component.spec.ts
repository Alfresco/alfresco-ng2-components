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
import { NodesApiService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { fakeNodeWithPermissions, fakeNodeInheritedOnly, fakeNodeWithOnlyLocally} from '../../../mock/permission-list.component.mock';

describe('PermissionDisplayComponent', () => {

    let fixture: ComponentFixture<PermissionListComponent>;
    let component: PermissionListComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PermissionListComponent
            ],
            providers: [NodesApiService]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PermissionListComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            nodeService = TestBed.get(NodesApiService);
        });
    }));

    afterEach(async(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    }));

    it('should be able to render the component', async() => {
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
    });

    it('should show the node permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithPermissions));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelectorAll('.adf-datatable-row').length).toBe(4);
    });

    it('should show inherited label for inherited permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeInheritedOnly));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-inherited-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-inherited-label')).not.toBeNull();
    });

    it('should show locally set label for locally set permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-locallyset-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-locallyset-label')).not.toBeNull();
    });

});
