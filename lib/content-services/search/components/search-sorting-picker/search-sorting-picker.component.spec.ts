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

import { SearchSortingPickerComponent } from './search-sorting-picker.component';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { AppConfigService } from '@alfresco/adf-core';

describe('SearchSortingPickerComponent', () => {

    let appConfig: AppConfigService;
    let queryBuilder: SearchQueryBuilderService;
    let component: SearchSortingPickerComponent;

    beforeEach(() => {
        appConfig = new AppConfigService(null);
        appConfig.config.search = {};

        queryBuilder = new SearchQueryBuilderService(appConfig, null);
        component = new SearchSortingPickerComponent(queryBuilder);
    });

    it('should load options from query builder', () => {
        const options = [
            <any> { key: 'one' },
            <any> { key: 'two' }
        ];
        spyOn(queryBuilder, 'getSortingOptions').and.returnValue(options);

        component.ngOnInit();

        expect(component.options.length).toBe(2);
        expect(component.options[0].key).toEqual('one');
        expect(component.options[1].key).toEqual('two');
    });

    it('should pre-select the primary sorting definition', () => {
        const options = [
            <any> { key: 'one' },
            <any> { key: 'two' }
        ];
        const sortingDefinition: any = { key: 'one', ascending: true };

        spyOn(queryBuilder, 'getSortingOptions').and.returnValue(options);
        spyOn(queryBuilder, 'getPrimarySorting').and.returnValue(sortingDefinition);

        component.ngOnInit();

        expect(component.value).toEqual(sortingDefinition.key);
        expect(component.ascending).toEqual(sortingDefinition.ascending);
    });

    it('should update query builder each time selected value is changed', () => {
        const options = [
            <any> { key: 'one' },
            <any> { key: 'two' }
        ];
        const sortingDefinition: any = { key: 'one', ascending: true };

        spyOn(queryBuilder, 'getPrimarySorting').and.returnValue(sortingDefinition);
        spyOn(queryBuilder, 'getSortingOptions').and.returnValue(options);
        spyOn(queryBuilder, 'update').and.stub();

        component.ngOnInit();
        component.onChanged(<any>{ value: 'two' });

        expect(queryBuilder.sorting.length).toBe(1);
        expect(queryBuilder.sorting[0].key).toEqual('two');
        expect(queryBuilder.sorting[0].ascending).toBeTruthy();
    });

    it('should update query builder each time sorting order is changed', () => {
        const options = [
            <any> { key: 'one' },
            <any> { key: 'two' }
        ];
        const sortingDefinition: any = { key: 'one', ascending: true };

        spyOn(queryBuilder, 'getPrimarySorting').and.returnValue(sortingDefinition);
        spyOn(queryBuilder, 'getSortingOptions').and.returnValue(options);
        spyOn(queryBuilder, 'update').and.stub();

        component.ngOnInit();
        component.toggleSortDirection();

        expect(queryBuilder.sorting.length).toBe(1);
        expect(queryBuilder.sorting[0].key).toEqual('one');
        expect(queryBuilder.sorting[0].ascending).toBeFalsy();
    });

});
