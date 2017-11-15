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

import { async, TestBed } from '@angular/core/testing';
import { DataColumnComponent } from './data-column.component';

describe('DataColumnListComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DataColumnComponent
            ]
        }).compileComponents();
    }));

    it('should create the component', () => {
        const fixture = TestBed.createComponent(DataColumnComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    });

    it('sould setup screen reader title for thumbnails', () => {
        const component = new DataColumnComponent();
        component.key = '$thumbnail';
        expect(component.srTitle).toBeFalsy();
        component.ngOnInit();
        expect(component.srTitle).toBeTruthy();
    });

});
