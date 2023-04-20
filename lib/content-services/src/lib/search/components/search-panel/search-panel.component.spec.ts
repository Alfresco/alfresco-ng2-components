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

import { SearchCheckListComponent, SearchListOption } from '../search-check-list/search-check-list.component';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { sizeOptions, stepOne, stepThree } from '../../../mock';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchCheckListComponent', () => {
    let fixture: ComponentFixture<SearchCheckListComponent>;
    let component: SearchCheckListComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchCheckListComponent);
        component = fixture.componentInstance;
    });

    it('should setup options from settings', () => {
        const options: any = [
            { name: 'Folder', value: `TYPE:'cm:folder'` },
            { name: 'Document', value: `TYPE:'cm:content'` }
        ];
        component.settings = { options } as any;
        component.ngOnInit();

        expect(component.options.items).toEqual(options);
    });

    it('should handle enter key as click on checkboxes', () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: `TYPE:'cm:folder'`, checked: false },
            { name: 'Document', value: `TYPE:'cm:content'`, checked: false }
        ]);

        component.ngOnInit();
        fixture.detectChanges();

        const optionElements = fixture.debugElement.queryAll(By.css('mat-checkbox'));

        optionElements[0].triggerEventHandler('keydown.enter', {});
        expect(component.options.items[0].checked).toBeTruthy();

        optionElements[0].triggerEventHandler('keydown.enter', {});
        expect(component.options.items[0].checked).toBeFalsy();
    });

    it('should setup operator from the settings', () => {
        component.settings = { operator: 'AND' } as any;
        component.ngOnInit();
        expect(component.operator).toBe('AND');
    });

    it('should use OR operator by default', () => {
        component.settings = { operator: null } as any;
        component.ngOnInit();
        expect(component.operator).toBe('OR');
    });

    it('should update query builder on checkbox change', () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: `TYPE:'cm:folder'`, checked: false },
            { name: 'Document', value: `TYPE:'cm:content'`, checked: false }
        ]);

        component.id = 'checklist';
        component.context = {
            queryFragments: {},
            update: () => {}
        } as any;

        component.ngOnInit();

        spyOn(component.context, 'update').and.stub();

        component.changeHandler(
            { checked: true } as any,
            component.options.items[0]
        );

        expect(component.context.queryFragments[component.id]).toEqual(`TYPE:'cm:folder'`);

        component.changeHandler(
            { checked: true } as any,
            component.options.items[1]
        );

        expect(component.context.queryFragments[component.id]).toEqual(
            `TYPE:'cm:folder' OR TYPE:'cm:content'`
        );
    });

    it('should reset selected boxes', () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: `TYPE:'cm:folder'`, checked: true },
            { name: 'Document', value: `TYPE:'cm:content'`, checked: true }
        ]);

        component.reset();

        expect(component.options.items[0].checked).toBeFalsy();
        expect(component.options.items[1].checked).toBeFalsy();
    });

    it('should update query builder on reset', () => {
        component.id = 'checklist';
        component.context = {
            queryFragments: {
                checklist: 'query'
            },
            update: () => {}
        } as any;
        spyOn(component.context, 'update').and.stub();

        component.ngOnInit();
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: `TYPE:'cm:folder'`, checked: true },
            { name: 'Document', value: `TYPE:'cm:content'`, checked: true }
        ]);

        component.reset();

        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('');
    });

    describe('Pagination', () => {
        it('should show 5 items when pageSize not defined', () => {
            component.id = 'checklist';
            component.context = {
                queryFragments: {
                    checklist: 'query'
                },
                update: () => {}
            } as any;
            component.settings = { options: sizeOptions } as any;

            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            expect(optionElements.length).toEqual(5);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepOne);
        });

        it('should show all items when pageSize is high', () => {
            component.id = 'checklist';
            component.context = {
                queryFragments: {
                    checklist: 'query'
                },
                update: () => {}
            } as any;
            component.settings = { pageSize: 15, options: sizeOptions } as any;
            component.ngOnInit();
            fixture.detectChanges();

            const optionElements = fixture.debugElement.queryAll(By.css('mat-checkbox'));
            expect(optionElements.length).toEqual(13);
            const labels = Array.from(optionElements).map(element => element.nativeElement.innerText);
            expect(labels).toEqual(stepThree);
        });
    });

    it('should able to check/reset the checkbox', () => {
        component.id = 'checklist';
        component.context = {
            queryFragments: {
                checklist: 'query'
            },
            update: () => {}
        } as any;
        component.settings = { options: sizeOptions } as any;
        spyOn(component, 'submitValues').and.stub();
        component.ngOnInit();
        fixture.detectChanges();

        const optionElements = fixture.debugElement.query(By.css('mat-checkbox'));
        optionElements.triggerEventHandler('change', { checked: true });

        expect(component.submitValues).toHaveBeenCalled();

        const clearAllElement = fixture.debugElement.query(By.css('button[title="SEARCH.FILTER.ACTIONS.CLEAR-ALL"]'));
        clearAllElement.triggerEventHandler('click', {} );
        fixture.detectChanges();

        const selectedElements = fixture.debugElement.queryAll(By.css('.mat-checkbox-checked'));
        expect(selectedElements.length).toBe(0);
    });
});
