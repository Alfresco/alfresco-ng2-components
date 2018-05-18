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
import { SearchConfiguration } from '../../search-configuration.interface';

describe('SearchSortingPickerComponent', () => {

    let queryBuilder: SearchQueryBuilderService;
    let component: SearchSortingPickerComponent;

    const buildConfig = (searchSettings): AppConfigService => {
        const config = new AppConfigService(null);
        config.config.search = searchSettings;
        return config;
    };

    beforeEach(() => {
        const config: SearchConfiguration = {
            sorting: {
                options: [
                    <any> { 'key': 'name', 'label': 'Name', 'type': 'FIELD', 'field': 'cm:name', 'ascending': true },
                    <any> { 'key': 'content.sizeInBytes', 'label': 'Size', 'type': 'FIELD', 'field': 'content.size', 'ascending': true },
                    <any> { 'key': 'description', 'label': 'Description', 'type': 'FIELD', 'field': 'cm:description', 'ascending': true }
                ],
                defaults: [
                    <any> { 'key': 'name', 'type': 'FIELD', 'field': 'cm:name', 'ascending': true }
                ]
            },
            categories: [
                <any> { id: 'cat1', enabled: true }
            ]
        };
        queryBuilder = new SearchQueryBuilderService(buildConfig(config), null);
        component = new SearchSortingPickerComponent(queryBuilder);
    });

    it('should load options from query builder', () => {
        component.ngOnInit();

        expect(component.options.length).toBe(3);
        expect(component.options[0].key).toEqual('name');
        expect(component.options[1].key).toEqual('content.sizeInBytes');
        expect(component.options[2].key).toEqual('description');
    });

    it('should pre-select the primary sorting definition', () => {
        component.ngOnInit();

        expect(component.value).toEqual('name');
        expect(component.ascending).toBeTruthy();
    });

    it('should update query builder each time selection is changed', () => {
        spyOn(queryBuilder, 'update').and.stub();

        component.ngOnInit();
        component.onChanged({ key: 'description', ascending: false });

        expect(queryBuilder.update).toHaveBeenCalled();
        expect(queryBuilder.sorting.length).toBe(1);
        expect(queryBuilder.sorting[0].key).toEqual('description');
        expect(queryBuilder.sorting[0].ascending).toBeFalsy();
    });
});
