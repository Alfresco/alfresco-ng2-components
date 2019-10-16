/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NodeDeleteDirective } from './node-delete.directive';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { TranslationService } from '../services/translation.service';
import { TranslationMock } from '../mock/translation.service.mock';

@Component({
    template: `
        <div id="delete-component" [adf-delete]="selection"
             (delete)="onDelete()">
        </div>`
})
class TestComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective)
    deleteDirective: NodeDeleteDirective;

    onDelete() {
    }
}

@Component({
    template: `
        <div id="delete-component" [adf-check-allowable-operation]="selection"
             [adf-delete]="selection"
             (delete)="onDelete($event)">
        </div>`
})
class TestWithPermissionsComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective)
    deleteDirective: NodeDeleteDirective;

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
    deleteDirective: NodeDeleteDirective;

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
    let deleteNodeSpy: any;
    let purgeDeletedNodeSpy: any;
    let disposableDelete: any;

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
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        alfrescoApi = TestBed.get(AlfrescoApiService);
        nodeApi = alfrescoApi.nodesApi;
        deleteNodeSpy = spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());
        purgeDeletedNodeSpy = spyOn(nodeApi, 'purgeDeletedNode').and.returnValue(Promise.resolve());

        fixture = TestBed.createComponent(TestComponent);
        fixtureWithPermissions = TestBed.createComponent(TestWithPermissionsComponent);
        fixtureWithPermanentComponent = TestBed.createComponent(TestDeletePermanentComponent);

        component = fixture.componentInstance;
        componentWithPermissions = fixtureWithPermissions.componentInstance;
        componentWithPermanentDelete = fixtureWithPermanentComponent.componentInstance;

        element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
        elementWithPermissions = fixtureWithPermissions.debugElement.query(By.directive(NodeDeleteDirective));
        elementWithPermanentDelete = fixtureWithPermanentComponent.debugElement.query(By.directive(NodeDeleteDirective));
    });

    afterEach(() => {
        if (disposableDelete) {
            disposableDelete.unsubscribe();
        }
        fixture.destroy();
    });

    describe('Delete', () => {

        it('should do nothing if selection is empty', () => {
            component.selection = [];

            fixture.detectChanges();
            element.nativeElement.click();

            expect(deleteNodeSpy).not.toHaveBeenCalled();
        });

        it('should process node successfully', (done) => {
            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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
            deleteNodeSpy.and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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
            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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
            deleteNodeSpy.and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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
            deleteNodeSpy.and.callFake((id) => {
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

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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
            deleteNodeSpy.and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                }

                return Promise.resolve();
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
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

        it('should emit event when delete is done', (done) => {
            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];
            fixture.detectChanges();

            element.nativeElement.click();
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe(() => {
                done();
            });
        });

        it('should disable the button if no node are selected', (done) => {
            component.selection = [];

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.nativeElement.disabled).toEqual(true);
                done();
            });
        });

        it('should disable the button if selected node is null', (done) => {
            component.selection = null;

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(element.nativeElement.disabled).toEqual(true);
                done();
            });
        });

        it('should enable the button if nodes are selected', (done) => {
            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(element.nativeElement.disabled).toEqual(false);
                done();
            });
        });

        it('should not enable the button if adf-check-allowable-operation is present', (done) => {
            elementWithPermissions.nativeElement.disabled = false;
            componentWithPermissions.selection = [];

            fixtureWithPermissions.detectChanges();

            componentWithPermissions.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixtureWithPermissions.detectChanges();

            fixture.whenStable().then(() => {
                expect(elementWithPermissions.nativeElement.disabled).toEqual(false);
                done();
            });
        });

        describe('Permanent', () => {

            it('should call the api with permanent delete option if permanent directive input is true', (done) => {
                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1' } }
                ];

                fixtureWithPermanentComponent.detectChanges();

                elementWithPermanentDelete.nativeElement.click();

                fixture.whenStable().then(() => {
                    expect(deleteNodeSpy).toHaveBeenCalledWith('1', { permanent: true });
                    done();
                });
            });

            it('should call the trashcan api if permanent directive input is true and the file is already in the trashcan ', (done) => {
                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1', archivedAt: 'archived' } }
                ];

                fixtureWithPermanentComponent.detectChanges();

                elementWithPermanentDelete.nativeElement.click();

                fixture.whenStable().then(() => {
                    expect(purgeDeletedNodeSpy).toHaveBeenCalledWith('1');
                    done();
                });
            });

        });
    });

});
