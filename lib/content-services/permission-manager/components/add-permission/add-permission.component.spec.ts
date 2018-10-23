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
import { AddPermissionComponent } from './add-permission.component';
import { AddPermissionPanelComponent } from './add-permission-panel.component';
import { By } from '@angular/platform-browser';
import { setupTestBed, NodesApiService } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { fakeAuthorityResults } from '../../../mock/add-permission.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { NodePermissionService } from '../../services/node-permission.service';

describe('AddPermissionComponent', () => {

    let fixture: ComponentFixture<AddPermissionComponent>;
    let element: HTMLElement;
    let nodePermissionService: NodePermissionService;
    let nodeApiService: NodesApiService;

    setupTestBed({
        imports: [
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        nodeApiService  = TestBed.get(NodesApiService);
        spyOn(nodeApiService, 'getNode').and.returnValue(of({ id: 'fake-node', allowableOperations: ['updatePermissions']}));
        fixture = TestBed.createComponent(AddPermissionComponent);
        element = fixture.nativeElement;
        nodePermissionService = TestBed.get(NodePermissionService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to render the component', () => {
        expect(element.querySelector('#adf-add-permission-type-search')).not.toBeNull();
        expect(element.querySelector('#searchInput')).not.toBeNull();
        expect(element.querySelector('#adf-add-permission-actions')).not.toBeNull();
        const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-add-permission-action-button');
        expect(addButton.disabled).toBeTruthy();
    });

    it('should enable the ADD button when a selection is sent', async(() => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-add-permission-action-button');
            expect(addButton.disabled).toBeFalsy();
        });
    }));

    it('should NOT enable the ADD button when a selection is sent but the user does not have the permissions', async(() => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        fixture.componentInstance.currentNode = {id: 'fake-node-id'};
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-add-permission-action-button');
            expect(addButton.disabled).toBeTruthy();
        });
    }));

    it('should emit a success event when the node is updated', (done) => {
        fixture.componentInstance.selectedItems = fakeAuthorityResults;
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(of({ id: 'fake-node-id'}));

        fixture.componentInstance.success.subscribe((node) => {
            expect(node.id).toBe('fake-node-id');
            done();
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-add-permission-action-button');
            addButton.click();
        });
    });

    it('should NOT emit a success event when the user does not have permission to update the node', () => {
        fixture.componentInstance.selectedItems = fakeAuthorityResults;
        fixture.componentInstance.currentNode = { id: 'fake-node-id' };
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(of({ id: 'fake-node-id' }));

        let spySuccess = spyOn(fixture.componentInstance, 'success');
        fixture.componentInstance.applySelection();
        expect(spySuccess).not.toHaveBeenCalled();
    });

    it('should emit an error event when the node update fail', (done) => {
        fixture.componentInstance.selectedItems = fakeAuthorityResults;
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(throwError({ error: 'err'}));

        fixture.componentInstance.error.subscribe((error) => {
            expect(error.error).toBe('err');
            done();
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-add-permission-action-button');
            addButton.click();
        });
    });

});
