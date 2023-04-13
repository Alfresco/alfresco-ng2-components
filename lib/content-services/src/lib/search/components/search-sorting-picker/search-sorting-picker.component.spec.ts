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

import { SearchSortingPickerComponent } from './search-sorting-picker.component';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { SearchConfiguration } from '../../models/search-configuration.interface';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('SearchSortingPickerComponent', () => {

    let queryBuilder: SearchQueryBuilderService;
    let component: SearchSortingPickerComponent;

    const buildConfig = (searchSettings): AppConfigService => {
        const config = TestBed.inject(AppConfigService);
        config.config.search = searchSettings;
        return config;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });

        const config: SearchConfiguration = {
            sorting: {
                options: [
                    { key: 'name', label: 'Name', type: 'FIELD', field: 'cm:name', ascending: true },
                    { key: 'content.sizeInBytes', label: 'Size', type: 'FIELD', field: 'content.size', ascending: true },
                    { key: 'description', label: 'Description', type: 'FIELD', field: 'cm:description', ascending: true }
                ],
                defaults: [
                    { key: 'name', type: 'FIELD', field: 'cm:name', ascending: false } as any
                ]
            },
            categories: [
                { id: 'cat1', enabled: true } as any
            ]
        };
        const alfrescoApiService = TestBed.inject(AlfrescoApiService);

        queryBuilder = new SearchQueryBuilderService(buildConfig(config), alfrescoApiService);
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
        expect(component.ascending).toBe(false);
    });

    it('should update query builder each time selection is changed', () => {
        spyOn(queryBuilder, 'update').and.stub();

        component.ngOnInit();
        component.onValueChanged('description');

        expect(queryBuilder.update).toHaveBeenCalled();
        expect(queryBuilder.sorting.length).toBe(1);
        expect(queryBuilder.sorting[0].key).toEqual('description');
        expect(queryBuilder.sorting[0].ascending).toBeTruthy();
    });

    it('should update query builder each time sorting is changed', () => {
        spyOn(queryBuilder, 'update').and.stub();

        component.ngOnInit();
        component.onSortingChanged(false);

        expect(queryBuilder.update).toHaveBeenCalled();
        expect(queryBuilder.sorting.length).toBe(1);
        expect(queryBuilder.sorting[0].key).toEqual('name');
        expect(queryBuilder.sorting[0].ascending).toBeFalsy();
    });
});
