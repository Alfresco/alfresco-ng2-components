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

import { Component, DebugElement, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NodeDeleteDirective } from './node-delete.directive';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';

@Component({
    template: `
        <div id="delete-component" [adf-delete]="selection"
             (delete)="onDelete($event)">
        </div>`
})
class TestComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective)
    deleteDirective;

    onDelete = jasmine.createSpy('onDelete');
}

@Component({
    template: `
        <div id="delete-component" [adf-node-permission]="selection"
             [adf-delete]="selection"
             (delete)="onDelete($event)">
        </div>`
})
class TestWithPermissionsComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective)
    deleteDirective;

    onDelete = jasmine.createSpy('onDelete');
}

@Component({
    template: `
        delete permanent
        <div id="delete-permanent"
             [adf-delete]="selection"
             [permanent]="permanent"
             (delete)="onDelete($event)">
        </div>`
})
class TestDeletePermanentComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective)
    deleteDirective;

    permanent = true;

    onDelete = jasmine.createSpy('onDelete');
}

describe('NodeDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let fixtureWithPermissions: ComponentFixture<TestWithPermissionsComponent>;
    let fixtureWithPermanentComponent: ComponentFixture<TestDeletePermanentComponent>;
    let element: DebugElement;
    let elementWithPermissions: DebugElement;
    let elementWithPermanentDelete: DebugElement;
    let component: TestComponent;
    let componentWithPermissions: TestWithPermissionsComponent;
    let componentWithPermanentDelete: TestDeletePermanentComponent;
    let alfrescoApi: AlfrescoApiService;
    let nodeApi;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            TestComponent,
            TestWithPermissionsComponent,
            TestDeletePermanentComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixtureWithPermissions = TestBed.createComponent(TestWithPermissionsComponent);
        fixtureWithPermanentComponent = TestBed.createComponent(TestDeletePermanentComponent);

        component = fixture.componentInstance;
        componentWithPermissions = fixtureWithPermissions.componentInstance;
        componentWithPermanentDelete = fixtureWithPermanentComponent.componentInstance;

        element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
        elementWithPermissions = fixtureWithPermissions.debugElement.query(By.directive(NodeDeleteDirective));
        elementWithPermanentDelete = fixtureWithPermanentComponent.debugElement.query(By.directive(NodeDeleteDirective));

        alfrescoApi = TestBed.get(AlfrescoApiService);
        nodeApi = alfrescoApi.getInstance().nodes;
    }));

    describe('Delete', () => {

        it('should do nothing if selection is empty', () => {
            spyOn(nodeApi, 'deleteNode');
            component.selection = [];

            fixture.detectChanges();
            element.nativeElement.click();

            expect(nodeApi.deleteNode).not.toHaveBeenCalled();
        });

        it('should process node successfully', (done) => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.SINGULAR'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should notify failed node deletion', (done) => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.ERROR_SINGULAR'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should notify nodes deletion', (done) => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PLURAL'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should notify failed nodes deletion', (done) => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.ERROR_PLURAL'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should notify partial deletion when only one node is successful', (done) => {
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

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PARTIAL_SINGULAR'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should notify partial deletion when some nodes are successful', (done) => {
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

            component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PARTIAL_PLURAL'
                );
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should emit event when delete is done', fakeAsync(() => {
            component.onDelete.calls.reset();
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.nativeElement.click();
            tick();

            expect(component.onDelete).toHaveBeenCalled();
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

        describe('Permanent', () => {

            it('should call the api with permamnet delete option if permanent directive input is true', fakeAsync(() => {
                let deleteApi = spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1' }
                ];

                fixtureWithPermanentComponent.detectChanges();

                elementWithPermanentDelete.nativeElement.click();
                tick();

                expect(deleteApi).toHaveBeenCalledWith('1', { permanent: true });
            }));

            it('should call the traschan api if permanent directive input is true and the file is already in the trashcan ', fakeAsync(() => {
                let deleteApi = spyOn(nodeApi, 'purgeDeletedNode').and.returnValue(Promise.resolve());

                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1', archivedAt: 'archived' } }
                ];

                fixtureWithPermanentComponent.detectChanges();

                elementWithPermanentDelete.nativeElement.click();
                tick();

                expect(deleteApi).toHaveBeenCalledWith('1');
            }));

        });
    });

});
