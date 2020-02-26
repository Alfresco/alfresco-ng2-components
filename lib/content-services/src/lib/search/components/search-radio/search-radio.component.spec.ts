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

import { sizeOptions, stepOne, stepThree } from '../../../mock';
import { By } from '@angular/platform-browser';
import { SearchRadioComponent } from './search-radio.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('SearchRadioComponent', () => {
   let fixture: ComponentFixture<SearchRadioComponent>;
   let component: SearchRadioComponent;

   setupTestBed({
       imports: [ ContentTestingModule ]
   });

   beforeEach(() => {
       fixture = TestBed.createComponent(SearchRadioComponent);
       component = fixture.componentInstance;
   });

   describe('Pagination', () => {
        it('should show 5 items when pageSize not defined', () => {
            component.id = 'checklist';
            component.context = <any> {
                queryFragments: {
                    'checklist': 'query'
                },
                update() {}
            };
            component.settings = <any> { options: sizeOptions };

            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-radio-button'));
            expect(optionElements.length).toEqual(5);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepOne);
        });

        it('should show all items when pageSize is high', () => {
            component.id = 'checklist';
            component.context = <any> {
                queryFragments: {
                    'checklist': 'query'
                },
                update() {}
            };
            component.settings = <any> { pageSize: 15, options: sizeOptions };
            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-radio-button'));
            expect(optionElements.length).toEqual(13);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepThree);
        });
    });

   it('should able to check the radio button', () => {
        component.id = 'checklist';
        component.context = <any> {
            queryFragments: {
                'checklist': 'query'
            },
            update: () => {}
        };
        component.settings = <any> { options: sizeOptions };
        spyOn(component.context, 'update').and.stub();
        component.ngOnInit();
        fixture.detectChanges();

        const optionElements = fixture.debugElement.query(By.css('mat-radio-button'));
        optionElements.triggerEventHandler('change', { checked: true });

        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe(sizeOptions[0].value);
    });
});
