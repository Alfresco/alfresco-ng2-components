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
import { setupTestBed } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';
import { fakeAuthorityResults } from '../../../mock/add-permission.component.mock';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { NodePermissionService } from '../../services/node-permission.service';

/*tslint:disable:ban*/
fdescribe('AddPermissionComponent', () => {

    let fixture: ComponentFixture<AddPermissionComponent>;
    let element: HTMLElement;
    let nodePermissionService: NodePermissionService;

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [NodePermissionService]
    });

    beforeEach(() => {
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
        expect(element.querySelector('#add-permission-actions')).not.toBeNull();
        const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-action-button');
        expect(addButton.disabled).toBeTruthy();
    });

    it('should enable the ADD button when a selection is sent', async(() => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-action-button');
            expect(addButton.disabled).toBeFalsy();
        });
    }));

    it('should emit a success event when the node is updated', async(() => {
        fixture.componentInstance.selectedItems = fakeAuthorityResults;
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(Observable.of({ id: 'fake-node-id'}));

        fixture.componentInstance.success.subscribe((node) => {
            expect(node.id).toBe('fake-node-id');
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-action-button');
            addButton.click();
        });
    }));

    it('should emit an error event when the node update fail', async(() => {
        fixture.componentInstance.selectedItems = fakeAuthorityResults;
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(Observable.throw({ error: 'errored'}));

        fixture.componentInstance.error.subscribe((error) => {
            expect(error.error).toBe('errored');
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const addButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-action-button');
            addButton.click();
        });
    }));

});
