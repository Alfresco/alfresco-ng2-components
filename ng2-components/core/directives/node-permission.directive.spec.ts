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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ServicesModule } from '../../index';
import { AlfrescoContentService } from './../services/alfresco-content.service';
import { NodePermissionDirective } from './node-permission.directive';

@Component({
    template: `
        <div [adf-node-permission]="'delete'" [adf-nodes]="selection">
        </div>`
})
class TestComponent {
    selection = [];
    disabled = false;
    done = jasmine.createSpy('done');
}

describe('NodePermissionDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoContentService: AlfrescoContentService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ServicesModule
            ],
            declarations: [
                TestComponent
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TestComponent);
                alfrescoContentService = TestBed.get(AlfrescoContentService);
                component = fixture.componentInstance;
                element = fixture.debugElement.query(By.directive(NodePermissionDirective));
            });
    }));

    it('Should be disabled if no nodes are passed', () => {
        component.selection = undefined;

        fixture.detectChanges();

        component.selection = null;

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(true);
    });

    it('Should be disabled if nodes is an empty array', () => {
        component.selection = null;

        fixture.detectChanges();

        component.selection = [];

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(true);
    });

    it('enables element when all nodes have expected permission', () => {
        spyOn(alfrescoContentService, 'hasPermission').and.returnValue(true);

        component.selection = null;

        fixture.detectChanges();

        component.selection = <any> [{entry: {id: '1', name: 'name1'}}];

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(false);
    });

    it('disables element when one of the nodes have no permission', () => {
        spyOn(alfrescoContentService, 'hasPermission').and.returnValue(false);

        component.selection = null;

        fixture.detectChanges();

        component.selection = <any> [{entry: {id: '1', name: 'name1'}}];

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(true);
    });
});

})
