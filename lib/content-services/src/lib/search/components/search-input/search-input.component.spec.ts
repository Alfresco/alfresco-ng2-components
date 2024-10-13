/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SearchConfiguration, SearchInputComponent } from '@alfresco/adf-content-services';
import { AppConfigService } from '@alfresco/adf-core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('SearchInputComponent', () => {
    let loader: HarnessLoader;
    let component: SearchInputComponent;
    let fixture: ComponentFixture<SearchInputComponent>;
    let appConfig: AppConfigService;

    /**
     * Sets the search input value
     * @param value the value to set
     */
    async function setInputValue(value: string) {
        const input = await loader.getHarness(MatInputHarness);
        await input.setValue(value);
        await (await input.host()).dispatchEvent('change');

        fixture.detectChanges();
        await fixture.whenStable();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SearchInputComponent]
        });

        fixture = TestBed.createComponent(SearchInputComponent);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        appConfig = TestBed.inject(AppConfigService);
    });

    it('should show custom placeholder', async () => {
        component.placeholder = 'custom placeholder';

        const input = await loader.getHarness(MatInputHarness);
        const placeholder = await input.getPlaceholder();
        expect(placeholder).toBe('custom placeholder');
    });

    it('should use multiple fields', async () => {
        component.fields = ['cm:description', 'TAG'];

        fixture.detectChanges();
        await fixture.whenStable();

        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('test');

        expect(formatted).toBe('(cm:description:"test*" OR TAG:"test*")');
    });

    it('should override input fields if search configuration is set', () => {
        appConfig.config = {
            search: {
                'app:fields': ['TEXT', 'description']
            }
        };
        expect(component.fields).toEqual(['cm:name']);
        const config = appConfig.get<SearchConfiguration>('search');
        const destFields = config['app:fields'];

        component.ngOnInit();
        fixture.detectChanges();
        expect(component.fields).toEqual(destFields);
    });

    it('should emit changed event with [cm:name]', async () => {
        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('test');

        expect(formatted).toBe('(cm:name:"test*")');
    });

    it('should not append asterisk if one is already provided', async () => {
        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('*');

        expect(formatted).toBe('(cm:name:"*")');
    });

    it('should format with AND by default', async () => {
        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('one two');

        expect(formatted).toBe('(cm:name:"one*") AND (cm:name:"two*")');
    });

    it('should format with OR if specified directly', async () => {
        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('one OR two');

        expect(formatted).toBe('(cm:name:"one*") OR (cm:name:"two*")');
    });

    it('should format with AND if specified directly', async () => {
        let formatted = '';
        component.changed.subscribe((val) => (formatted = val));

        await setInputValue('one AND two');

        expect(formatted).toBe('(cm:name:"one*") AND (cm:name:"two*")');
    });
});
