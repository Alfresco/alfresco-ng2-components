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

import { SearchTextComponent } from './search-text.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('SearchTextComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SearchTextComponent>;
    let component: SearchTextComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchTextComponent);
        component = fixture.componentInstance;
        component.id = 'text';
        component.settings = {
            pattern: `cm:name:'(.*?)'`,
            field: 'cm:name',
            placeholder: 'Enter the name'
        };

        component.context = {
            queryFragments: {},
            update: () => {}
        } as any;

        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should parse value from the context at startup', () => {
        component.context.queryFragments[component.id] = `cm:name:'secret.pdf'`;
        fixture.detectChanges();

        expect(component.value).toEqual('secret.pdf');
    });

    it('should not parse value when pattern not defined', () => {
        component.settings.pattern = null;
        component.context.queryFragments[component.id] = `cm:name:'secret.pdf'`;
        fixture.detectChanges();

        expect(component.value).toEqual('');
    });

    it('should update query builder on change', () => {
        spyOn(component.context, 'update').and.stub();

        component.onChangedHandler({
            target: {
                value: 'top-secret.doc'
            }
        });

        expect(component.value).toBe('top-secret.doc');
        expect(component.context.queryFragments[component.id]).toBe(`cm:name:'top-secret.doc'`);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should reset query builder', () => {
        component.onChangedHandler({
            target: {
                value: 'top-secret.doc'
            }
        });

        expect(component.value).toBe('top-secret.doc');
        expect(component.context.queryFragments[component.id]).toBe(`cm:name:'top-secret.doc'`);

        component.onChangedHandler({
            target: {
                value: ''
            }
        });

        expect(component.value).toBe('');
        expect(component.context.queryFragments[component.id]).toBe('');
    });

    it('should show the custom/default name', async () => {
        component.context.queryFragments[component.id] = `cm:name:'secret.pdf'`;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.value).toEqual('secret.pdf');

        const input = await loader.getHarness(MatInputHarness);
        expect(await input.getValue()).toBe('secret.pdf');
    });

    it('should be able to reset by clicking clear button', async () => {
        component.context.queryFragments[component.id] = `cm:name:'secret.pdf'`;
        fixture.detectChanges();
        await fixture.whenStable();

        const clearButton = await loader.getHarness(MatButtonHarness);
        await clearButton.click();

        expect(component.value).toBe('');
        expect(component.context.queryFragments[component.id]).toBe('');
    });

    it('should update query with startValue on init, if provided', () => {
        spyOn(component.context, 'update');
        component.startValue = 'mock-start-value';
        fixture.detectChanges();

        expect(component.context.queryFragments[component.id]).toBe(`cm:name:'mock-start-value'`);
        expect(component.value).toBe('mock-start-value');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should parse value and set query context as blank, and not call query update, if no start value was provided', () => {
        component.context.queryFragments[component.id] = `cm:name:'secret.pdf'`;
        spyOn(component.context, 'update');
        component.startValue = undefined;
        fixture.detectChanges();

        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.value).toBe('secret.pdf');
        expect(component.context.update).not.toHaveBeenCalled();
    });
});
