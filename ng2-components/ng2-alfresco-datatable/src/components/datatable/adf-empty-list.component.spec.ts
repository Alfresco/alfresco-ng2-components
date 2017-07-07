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
import { CoreModule } from 'ng2-alfresco-core';
import { AdfEmptyListComponent } from './adf-empty-list.component';

describe('AdfEmptyListComponentComponent', () => {
    let component: AdfEmptyListComponent;
    let fixture: ComponentFixture<AdfEmptyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                AdfEmptyListComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdfEmptyListComponent);
        component = fixture.componentInstance;
    }));

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should show the default values', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.empty-list__this-space-is-empty').innerHTML).toEqual('This list is empty');
            expect(fixture.nativeElement.querySelector('.empty-list__drag-drop').innerHTML).toEqual('Drag and drop');
            expect(fixture.nativeElement.querySelector('.empty-list__any-files-here-to-add').innerHTML).toEqual('any files here to add');
            expect(fixture.nativeElement.querySelector('.empty-list__empty_doc_lib').src).toContain('empty_doc_lib');
        });
    }));

    it('should render the input values', async(() => {
        component.emptyMsg = 'Fake empty msg';
        component.dragDropMsg = 'Fake drag drop msg';
        component.additionalMsg = 'Fake additional msg';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.empty-list__this-space-is-empty').innerHTML).toEqual('Fake empty msg');
            expect(fixture.nativeElement.querySelector('.empty-list__drag-drop').innerHTML).toEqual('Fake drag drop msg');
            expect(fixture.nativeElement.querySelector('.empty-list__any-files-here-to-add').innerHTML).toEqual('Fake additional msg');
        });
    }));
});
