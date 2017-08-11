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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PathElementEntity } from 'alfresco-js-api';
import { CoreModule } from 'ng2-alfresco-core';
import { fakeNodeWithCreatePermission } from '../../assets/document-list.component.mock';
import { DocumentListComponent } from '../document-list.component';
import { BreadcrumbComponent } from './breadcrumb.component';

declare let jasmine: any;

describe('Breadcrumb', () => {

    let component: BreadcrumbComponent;
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                BreadcrumbComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadcrumbComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    it('should prevent default click behavior', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        component.onRoutePathClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should root be present as default node if the path is null', () => {
        let change = new SimpleChange(null, fakeNodeWithCreatePermission, true);

        component.root = 'default';
        component.ngOnChanges({'folderNode': change});

        expect(component.route[0].name).toBe('default');
    });

    it('should emit navigation event', (done) => {
        let node = <PathElementEntity> {id: '-id-', name: 'name'};
        component.navigate.subscribe(val => {
            expect(val).toBe(node);
            done();
        });

        component.onRoutePathClick(node, null);
    });

    it('should update document list on click', (done) => {
        let documentList = new DocumentListComponent(null, null, null);
        spyOn(documentList, 'loadFolderByNodeId').and.stub();

        let node = <PathElementEntity> {id: '-id-', name: 'name'};
        component.target = documentList;

        component.onRoutePathClick(node, null);
        setTimeout(() => {
            expect(documentList.loadFolderByNodeId).toHaveBeenCalledWith(node.id);
            done();
        }, 0);
    });
});
