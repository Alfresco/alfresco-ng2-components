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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { TreeViewComponent } from './tree-view.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TreeViewService } from '../services/tree-view.service';
import { of, throwError } from 'rxjs';
import { TreeBaseNode } from '../models/tree-view.model';
import { NodeEntry } from '@alfresco/js-api';
import { SimpleChange } from '@angular/core';

describe('TreeViewComponent', () => {

    let fixture: ComponentFixture<TreeViewComponent>;
    let element: HTMLElement;
    let treeService: TreeViewService;
    let component: any;

    const fakeNodeList: TreeBaseNode[] = [
        <TreeBaseNode> {
            nodeId: 'fake-node-id', name: 'fake-node-name', level: 0, expandable: true,
            node: { entry: { name: 'fake-node-name', id: 'fake-node-id' } }
        }
    ];

    const fakeChildrenList: TreeBaseNode[] = [
        <TreeBaseNode>  { nodeId: 'fake-child-id', name: 'fake-child-name', level: 0, expandable: true, node: {} },
        <TreeBaseNode>  { nodeId: 'fake-second-id', name: 'fake-second-name', level: 0, expandable: true, node: {} }
    ];

    const fakeNextChildrenList: TreeBaseNode[] = [
        <TreeBaseNode> {
            nodeId: 'fake-next-child-id',
            name: 'fake-next-child-name',
            level: 0,
            expandable: true,
            node: {}
        },
        <TreeBaseNode> {
            nodeId: 'fake-next-second-id',
            name: 'fake-next-second-name',
            level: 0,
            expandable: true,
            node: {}
        }
    ];

    const returnRootOrChildrenNode = function (nodeId: string) {
        if (nodeId === '9999999') {
            return of(fakeNodeList);
        } else if (nodeId === 'fake-second-id') {
            return of(fakeNextChildrenList);
        } else {
            return of(fakeChildrenList);
        }
    };

    setupTestBed({
        imports: [
            ContentTestingModule
        ],
        declarations: []
    });

    describe('When there is a nodeId', () => {

        beforeEach(async(() => {
            treeService = TestBed.get(TreeViewService);
            fixture = TestBed.createComponent(TreeViewComponent);
            element = fixture.nativeElement;
            component = fixture.componentInstance;
            spyOn(treeService, 'getTreeNodes').and.callFake((nodeId) => returnRootOrChildrenNode(nodeId));
            component.nodeId = '9999999';
            const changeNodeId = new SimpleChange(null, '9999999', true);
            component.ngOnChanges({ 'nodeId': changeNodeId });
            fixture.detectChanges();
        }));

        afterEach(() => {
            fixture.destroy();
        });

        it('should show the folder', async(() => {
            expect(element.querySelector('#fake-node-name-tree-child-node')).not.toBeNull();
        }));

        it('should show the subfolders when the folder is clicked', async(() => {
            const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-node-name');
            expect(rootFolderButton).not.toBeNull();
            rootFolderButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#fake-child-name-tree-child-node')).not.toBeNull();
                expect(element.querySelector('#fake-second-name-tree-child-node')).not.toBeNull();
            });
        }));

        it('should show only the correct subfolders when the nodeId is changed', async(() => {
            component.nodeId = 'fake-second-id';
            const changeNodeId = new SimpleChange('9999999', 'fake-second-id', true);
            component.ngOnChanges({ 'nodeId': changeNodeId });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-next-child-name');
                expect(rootFolderButton).not.toBeNull();
                rootFolderButton.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('#fake-child-name-tree-child-node')).not.toBeNull();
                    expect(element.querySelector('#fake-second-name-tree-child-node')).not.toBeNull();
                    expect(element.querySelectorAll('mat-tree-node').length).toBe(4);
                });
            });
        }));

        it('should throw a nodeClicked event when a node is clicked', (done) => {
            component.nodeClicked.subscribe((nodeClicked: NodeEntry) => {
                expect(nodeClicked).toBeDefined();
                expect(nodeClicked).not.toBeNull();
                expect(nodeClicked.entry.name).toBe('fake-node-name');
                expect(nodeClicked.entry.id).toBe('fake-node-id');
                done();
            });
            const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-node-name');
            expect(rootFolderButton).not.toBeNull();
            rootFolderButton.click();
        });

        it('should change the icon of the opened folders', async(() => {
            const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-node-name');
            expect(rootFolderButton).not.toBeNull();
            expect(element.querySelector('#button-fake-node-name .mat-icon').textContent.trim()).toBe('folder');
            rootFolderButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#button-fake-node-name .mat-icon').textContent.trim()).toBe('folder_open');
            });
        }));

        it('should show the subfolders of a subfolder if there are any', async(() => {
            const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-node-name');
            expect(rootFolderButton).not.toBeNull();
            rootFolderButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#fake-second-name-tree-child-node')).not.toBeNull();
                const childButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-second-name');
                expect(childButton).not.toBeNull();
                childButton.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('#fake-next-child-name-tree-child-node')).not.toBeNull();
                    expect(element.querySelector('#fake-next-second-name-tree-child-node')).not.toBeNull();
                });
            });
        }));

        it('should hide the subfolders when clicked again', async(() => {
            const rootFolderButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#button-fake-node-name');
            expect(rootFolderButton).not.toBeNull();
            rootFolderButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(element.querySelector('#fake-child-name-tree-child-node')).not.toBeNull();
                expect(element.querySelector('#fake-second-name-tree-child-node')).not.toBeNull();
                rootFolderButton.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(element.querySelector('#button-fake-node-name .mat-icon').textContent.trim()).toBe('folder');
                    expect(element.querySelector('#fake-child-name-tree-child-node')).toBeNull();
                    expect(element.querySelector('#fake-second-name-tree-child-node')).toBeNull();
                });
            });
        }));
    });

    describe('When no nodeId is given', () => {

        let emptyElement: HTMLElement;

        beforeEach(async(() => {
            fixture = TestBed.createComponent(TreeViewComponent);
            emptyElement = fixture.nativeElement;
        }));

        afterEach(() => {
            fixture.destroy();
        });

        it('should show an error message when no nodeId is provided', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(emptyElement.querySelector('#adf-tree-view-missing-node')).toBeDefined();
                expect(emptyElement.querySelector('#adf-tree-view-missing-node')).not.toBeNull();
            });
        }));
    });

    describe('When invalid nodeId is given', () => {

        beforeEach(async(() => {
            fixture = TestBed.createComponent(TreeViewComponent);
            treeService = TestBed.get(TreeViewService);
            spyOn(treeService, 'getTreeNodes').and.callFake(() => throwError('Invalid Node Id'));
            fixture.componentInstance.nodeId = 'Poopoovic';
        }));

        afterEach(() => {
            fixture.destroy();
        });

        it('should raise an error event when invalid nodeId is provided', (done) => {
            fixture.componentInstance.error.subscribe((error) => {
                expect(error).toBe('Invalid Node Id');
                done();
            });
            const changeNodeId = new SimpleChange(null, 'Poopoovic', true);
            fixture.componentInstance.ngOnChanges({ 'nodeId': changeNodeId });
            fixture.detectChanges();
        });
    });
});
