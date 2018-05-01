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

import { SimpleInheritedPermissionTestComponent } from '../../mock/inherited-permission.component.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionManagerModule } from '../../index';
import { NodesApiService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

const fakeNodeWithInherit: any = { id: 'fake-id', permissions : {isInheritanceEnabled : true}};
const fakeNodeNoInherit: any = { id: 'fake-id', permissions : {isInheritanceEnabled : false}};
/*tslint:disable:ban*/
fdescribe('InheritPermissionDirective', () => {

    let fixture: ComponentFixture<SimpleInheritedPermissionTestComponent>;
    let element: HTMLElement;
    let component: SimpleInheritedPermissionTestComponent;
    let nodeService: NodesApiService;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            PermissionManagerModule
        ],
        declarations: [
            SimpleInheritedPermissionTestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleInheritedPermissionTestComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        nodeService = TestBed.get(NodesApiService);
    });

    it('should be able to render the simple component', async(() => {
        fixture.detectChanges();
        expect(element.querySelector('#sample-button-permission')).not.toBeNull();
        expect(element.querySelector('#update-notification')).toBeNull();
    }));
    it('should be able to add inherited permission', async(() => {
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeNoInherit));
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, nodeBody) => {
            if (nodeBody.permissions.isInheritanceEnabled) {
                return Observable.of(fakeNodeWithInherit);
            } else {
                return Observable.of(fakeNodeNoInherit);
            }
        });
        fixture.detectChanges();
        const buttonPermission: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#sample-button-permission');
        expect(buttonPermission).not.toBeNull();
        expect(element.querySelector('#update-notification')).toBeNull();
        buttonPermission.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#update-notification')).not.toBeNull();
        });
    }));

    it('should be able to remove inherited permission', async(() => {
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithInherit));
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, nodeBody) => {
            if (nodeBody.permissions.isInheritanceEnabled) {
                return Observable.of(fakeNodeWithInherit);
            } else {
                return Observable.of(fakeNodeNoInherit);
            }
        });
        component.updatedNode = true;
        fixture.detectChanges();
        const buttonPermission: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#sample-button-permission');
        expect(buttonPermission).not.toBeNull();
        expect(element.querySelector('#update-notification')).not.toBeNull();
        buttonPermission.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#update-notification')).toBeNull();
        });
    }));

});
