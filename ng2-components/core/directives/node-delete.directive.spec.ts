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

import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NotificationService } from '../services/notification.service';
import { NodeDeleteDirective } from './node-delete.directive';

@Component({
    template: `
        <div [adf-delete]="selection"
             (delete)="done()">
        </div>`
})
class TestComponent {
    selection = [];

    done = jasmine.createSpy('done');
}

@Component({
    template: `
        <div [adf-node-permission]="selection" [adf-delete]="selection"
             (delete)="done()">
        </div>`
})
class TestWithPermissionsComponent {
    selection = [];

    done = jasmine.createSpy('done');
}

describe('NodeDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let fixtureWithPermissions: ComponentFixture<TestWithPermissionsComponent>;
    let element: DebugElement;
    let elementWithPermissions: DebugElement;
    let component: TestComponent;
    let componentWithPermissions: TestWithPermissionsComponent;
    let alfrescoApi: AlfrescoApiService;
    let notification: NotificationService;
    let nodeApi;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
            ],
            declarations: [
                TestComponent,
                TestWithPermissionsComponent
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TestComponent);
                fixtureWithPermissions = TestBed.createComponent(TestWithPermissionsComponent);
                component = fixture.componentInstance;
                componentWithPermissions = fixtureWithPermissions.componentInstance;
                element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
                elementWithPermissions = fixtureWithPermissions.debugElement.query(By.directive(NodeDeleteDirective));

                alfrescoApi = TestBed.get(AlfrescoApiService);
                nodeApi = alfrescoApi.getInstance().nodes;
                notification = TestBed.get(NotificationService);
            });
    }));

    describe('Delete', () => {
        beforeEach(() => {
            spyOn(notification, 'openSnackMessage');
        });

        it('should do nothing if selection is empty', () => {
            spyOn(nodeApi, 'deleteNode');
            component.selection = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(nodeApi.deleteNode).not.toHaveBeenCalled();
        });

        it('should process node successfully', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.SINGULAR'
            );
        }));

        it('should notify failed node deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.ERROR_SINGULAR'
            );
        }));

        it('should notify nodes deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PLURAL'
            );
        }));

        it('should notify failed nodes deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.ERROR_PLURAL'
            );
        }));

        it('should notify partial deletion when only one node is successful', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject('error');
                } else {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PARTIAL_SINGULAR'
            );
        }));

        it('should notify partial deletion when some nodes are successful', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                }

                if (id === '2') {
                    return Promise.resolve();
                }

                if (id === '3') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessage).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PARTIAL_PLURAL'
            );
        }));

        it('should emit event when delete is done', fakeAsync(() => {
            component.done.calls.reset();
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
        }));

        it('should disable the button if no node are selected', fakeAsync(() => {
            component.selection = [];

            fixture.detectChanges();

            expect(element.nativeElement.disabled).toEqual(true);
        }));

        it('should disable the button if selected node is null', fakeAsync(() => {
            component.selection = null;

            fixture.detectChanges();

            expect(element.nativeElement.disabled).toEqual(true);
        }));

        it('should enable the button if nodes are selected', fakeAsync(() => {
            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();

            expect(element.nativeElement.disabled).toEqual(false);
        }));

        it('should not enable the button if adf-node-permission is present', fakeAsync(() => {
            elementWithPermissions.nativeElement.disabled = false;
            componentWithPermissions.selection = [];

            fixtureWithPermissions.detectChanges();

            componentWithPermissions.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixtureWithPermissions.detectChanges();

            expect(elementWithPermissions.nativeElement.disabled).toEqual(false);
        }));

    });
});
