/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { sizeOptions, stepOne, stepThree } from '../../../mock';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { By } from '@angular/platform-browser';

describe('SearchCheckListComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SearchCheckListComponent>;
    let component: SearchCheckListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchCheckListComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
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

    it('should handle enter key as click on checkboxes', async () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: `TYPE:'cm:folder'`, checked: false },
            { name: 'Document', value: `TYPE:'cm:content'`, checked: false }
        ]);

        component.ngOnInit();
        fixture.detectChanges();

        const options = await loader.getAllHarnesses(MatCheckboxHarness);
        await (await options[0].host()).sendKeys(TestKey.ENTER);
        expect(await options[0].isChecked()).toBe(true);

        await (await options[0].host()).sendKeys(TestKey.ENTER);
        expect(await options[0].isChecked()).toBe(false);
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
            update: () => {
                /*noop*/
            }
        } as any;

        component.ngOnInit();

        spyOn(component.context, 'update').and.stub();

        component.changeHandler({ checked: true } as any, component.options.items[0]);

        expect(component.context.queryFragments[component.id]).toEqual(`TYPE:'cm:folder'`);

        component.changeHandler({ checked: true } as any, component.options.items[1]);

        expect(component.context.queryFragments[component.id]).toEqual(`TYPE:'cm:folder' OR TYPE:'cm:content'`);
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
            update: () => {
                /*noop*/
            }
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
        it('should show 5 items when pageSize not defined', async () => {
            component.id = 'checklist';
            component.context = {
                queryFragments: {
                    checklist: 'query'
                },
                update: () => {
                    /*noop*/
                }
            } as any;
            component.settings = { options: sizeOptions } as any;

            component.ngOnInit();
            fixture.detectChanges();

            const options = await loader.getAllHarnesses(MatCheckboxHarness);
            expect(options.length).toEqual(5);

            const labels = await Promise.all(Array.from(options).map(async (element) => element.getLabelText()));
            expect(labels).toEqual(stepOne);
        });

        it('should show all items when pageSize is high', async () => {
            component.id = 'checklist';
            component.context = {
                queryFragments: {
                    checklist: 'query'
                },
                update: () => {
                    /*noop*/
                }
            } as any;
            component.settings = { pageSize: 15, options: sizeOptions } as any;
            component.ngOnInit();
            fixture.detectChanges();

            const options = await loader.getAllHarnesses(MatCheckboxHarness);
            expect(options.length).toEqual(13);

            const labels = await Promise.all(Array.from(options).map(async (element) => element.getLabelText()));
            expect(labels).toEqual(stepThree);
        });
    });

    it('should able to check/reset the checkbox', async () => {
        component.id = 'checklist';
        component.context = {
            queryFragments: {
                checklist: 'query'
            },
            update: () => {
                /*noop*/
            }
        } as any;
        component.settings = { options: sizeOptions } as any;
        spyOn(component, 'submitValues').and.stub();
        component.ngOnInit();
        fixture.detectChanges();

        const checkbox = await loader.getHarness(MatCheckboxHarness);
        await checkbox.check();

        expect(component.submitValues).toHaveBeenCalled();

        const clearAllElement = fixture.debugElement.query(By.css('button[title="SEARCH.FILTER.ACTIONS.CLEAR-ALL"]'));
        clearAllElement.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(await checkbox.isChecked()).toBe(false);
    });
});
