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
import { EmptyListComponent } from './empty-list.component';

describe('EmptyListComponentComponent', () => {
    let component: EmptyListComponent;
    let fixture: ComponentFixture<EmptyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                EmptyListComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EmptyListComponent);
        component = fixture.componentInstance;
    }));

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should render the input values', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('.adf-empty-list_template')).toBeDefined();
        });
    }));
});
