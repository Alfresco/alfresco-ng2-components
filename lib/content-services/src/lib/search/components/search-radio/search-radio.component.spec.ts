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

import { sizeOptions, stepOne, stepThree } from '../../../mock';
import { By } from '@angular/platform-browser';
import { SearchRadioComponent } from './search-radio.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchRadioComponent', () => {
   let fixture: ComponentFixture<SearchRadioComponent>;
   let component: SearchRadioComponent;

   setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

   beforeEach(() => {
       fixture = TestBed.createComponent(SearchRadioComponent);
       component = fixture.componentInstance;
   });

   describe('Pagination', () => {
        it('should show 5 items when pageSize not defined', () => {
            component.id = 'radio';
            component.context = {
                queryFragments: {
                    radio: 'query'
                },
                update: () => {}
            } as any;
            component.settings = { options: sizeOptions } as any;

            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-radio-button'));
            expect(optionElements.length).toEqual(5);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepOne);
        });

        it('should show all items when pageSize is high', () => {
            component.id = 'radio';
            component.context = {
                queryFragments: {
                    radio: 'query'
                },
                update: () => {}
            } as any;
            component.settings = { pageSize: 15, options: sizeOptions } as any;
            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-radio-button'));
            expect(optionElements.length).toEqual(13);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepThree);
        });
    });

   it('should able to check the radio button', async () => {
        component.id = 'radio';
        component.context = {
            queryFragments: {
                radio: 'query'
            },
            update: () => {}
        } as any;
        component.settings = { options: sizeOptions } as any;
        spyOn(component.context, 'update').and.stub();
        fixture.detectChanges();
        await fixture.whenStable();

        const optionElements = fixture.debugElement.query(By.css('mat-radio-group'));
        optionElements.triggerEventHandler('change', { value: sizeOptions[0].value });
        fixture.detectChanges();

        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe(sizeOptions[0].value);
    });
});
