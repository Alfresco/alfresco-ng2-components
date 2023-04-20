/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NodeDeleteDirective } from './node-delete.directive';
import { setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentDirectiveModule } from './content-directive.module';

@Component({
    template: `
        <div id="delete-component" [adf-delete]="selection"
             (delete)="onDelete()">
        </div>`
})
class TestComponent {
    selection = [];

    @ViewChild(NodeDeleteDirective, { static: true })
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

    @ViewChild(NodeDeleteDirective, { static: true })
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

    @ViewChild(NodeDeleteDirective, { static: true })
    deleteDirective: NodeDeleteDirective;

    permanent = true;

    onDelete = jasmine.createSpy('onDelete');
}

describe('NodeDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let fixtureWithPermissions: ComponentFixture<TestWithPermissionsComponent>;
    let fixtureWithPermanentComponent: ComponentFixture<TestDeletePermanentComponent>;
    let element: DebugElement;
    let elementWithPermanentDelete: DebugElement;
    let component: TestComponent;
    let componentWithPermanentDelete: TestDeletePermanentComponent;
    let deleteNodeSpy: any;
    let disposableDelete: any;
    let deleteNodePermanentSpy: any;
    let purgeDeletedNodePermanentSpy: any;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            ContentDirectiveModule
        ],
        declarations: [
            TestComponent,
            TestWithPermissionsComponent,
            TestDeletePermanentComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixtureWithPermissions = TestBed.createComponent(TestWithPermissionsComponent);
        fixtureWithPermanentComponent = TestBed.createComponent(TestDeletePermanentComponent);

        component = fixture.componentInstance;
        componentWithPermanentDelete = fixtureWithPermanentComponent.componentInstance;

        element = fixture.debugElement.query(By.directive(NodeDeleteDirective));
        elementWithPermanentDelete = fixtureWithPermanentComponent.debugElement.query(By.directive(NodeDeleteDirective));

        deleteNodeSpy = spyOn(component.deleteDirective['nodesApi'], 'deleteNode').and.returnValue(Promise.resolve());

        deleteNodePermanentSpy = spyOn(componentWithPermanentDelete.deleteDirective['nodesApi'], 'deleteNode').and.returnValue(Promise.resolve());
        purgeDeletedNodePermanentSpy = spyOn(componentWithPermanentDelete.deleteDirective['trashcanApi'], 'deleteDeletedNode').and.returnValue(Promise.resolve());

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

        it('should process node successfully', async () => {
            component.selection = [{ entry: { id: '1', name: 'name1' } }];
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.SINGULAR'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should notify failed node deletion', async () => {
            deleteNodeSpy.and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.ERROR_SINGULAR'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should notify nodes deletion', async () => {
            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PLURAL'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should notify failed nodes deletion', async () => {
            deleteNodeSpy.and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.ERROR_PLURAL'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should notify partial deletion when only one node is successful', async () => {
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
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PARTIAL_SINGULAR'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should notify partial deletion when some nodes are successful', async () => {
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
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((message) => {
                expect(message).toBe(
                    'CORE.DELETE_NODE.PARTIAL_PLURAL'
                );
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should emit event when delete is done', async () => {
            component.selection = [{ entry: { id: '1', name: 'name1' } }];
            fixture.detectChanges();

            disposableDelete = component.deleteDirective.delete.subscribe((node) => {
                expect(node).toEqual('CORE.DELETE_NODE.SINGULAR');
            });

            element.nativeElement.click();
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should disable the button if no node are selected', () => {
            component.selection = [];

            fixture.detectChanges();
            expect(element.nativeElement.disabled).toEqual(true);
        });

        it('should disable the button if selected node is null', () => {
            component.selection = null;

            fixture.detectChanges();
            expect(element.nativeElement.disabled).toEqual(true);
        });

        it('should enable the button if nodes are selected', () => {
            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            expect(element.nativeElement.disabled).toEqual(false);
        });

        it('should not enable the button if adf-check-allowable-operation is present', () => {
            const elementWithPermissions = fixtureWithPermissions.debugElement.query(By.directive(NodeDeleteDirective));
            const componentWithPermissions = fixtureWithPermissions.componentInstance;

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
        });

        describe('Permanent', () => {

            it('should call the api with permanent delete option if permanent directive input is true', () => {
                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1' } }
                ];

                fixtureWithPermanentComponent.detectChanges();
                elementWithPermanentDelete.nativeElement.click();

                expect(deleteNodePermanentSpy).toHaveBeenCalledWith('1', { permanent: true });
            });

            it('should call the trashcan api if permanent directive input is true and the file is already in the trashcan ', () => {
                fixtureWithPermanentComponent.detectChanges();

                componentWithPermanentDelete.selection = [
                    { entry: { id: '1', name: 'name1', archivedAt: 'archived' } }
                ];

                fixtureWithPermanentComponent.detectChanges();
                elementWithPermanentDelete.nativeElement.click();

                expect(purgeDeletedNodePermanentSpy).toHaveBeenCalledWith('1');
            });
        });
    });
});
