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

import { SearchCheckListComponent, SearchListOption } from './search-check-list.component';
import { SearchFilterList } from '../search-filter/models/search-filter-list.model';

describe('SearchCheckListComponent', () => {

    let component: SearchCheckListComponent;

    beforeEach(() => {
        component = new SearchCheckListComponent();
    });

    it('should setup options from settings', () => {
        const options: any = [
            { 'name': 'Folder', 'value': "TYPE:'cm:folder'" },
            { 'name': 'Document', 'value': "TYPE:'cm:content'" }
        ];
        component.settings = <any> { options: options };
        component.ngOnInit();

        expect(component.options.items).toEqual(options);
    });

    it('should setup operator from the settings', () => {
        component.settings = <any> { operator: 'AND' };
        component.ngOnInit();
        expect(component.operator).toBe('AND');
    });

    it('should use OR operator by default', () => {
        component.settings = <any> { operator: null };
        component.ngOnInit();
        expect(component.operator).toBe('OR');
    });

    it('should update query builder on checkbox change', () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: "TYPE:'cm:folder'", checked: false },
            { name: 'Document', value: "TYPE:'cm:content'", checked: false }
        ]);

        component.id = 'checklist';
        component.context = <any> {
            queryFragments: {},
            update() {}
        };

        component.ngOnInit();

        spyOn(component.context, 'update').and.stub();

        component.changeHandler(
            <any> { checked: true },
            component.options.items[0]
        );

        expect(component.context.queryFragments[component.id]).toEqual(`TYPE:'cm:folder'`);

        component.changeHandler(
            <any> { checked: true },
            component.options.items[1]
        );

        expect(component.context.queryFragments[component.id]).toEqual(
            `TYPE:'cm:folder' OR TYPE:'cm:content'`
        );
    });

    it('should reset selected boxes', () => {
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: "TYPE:'cm:folder'", checked: true },
            { name: 'Document', value: "TYPE:'cm:content'", checked: true }
        ]);

        component.reset();

        expect(component.options.items[0].checked).toBeFalsy();
        expect(component.options.items[1].checked).toBeFalsy();
    });

    it('should update query builder on reset', () => {
        component.id = 'checklist';
        component.context = <any> {
            queryFragments: {
                'checklist': 'query'
            },
            update() {}
        };
        spyOn(component.context, 'update').and.stub();

        component.ngOnInit();
        component.options = new SearchFilterList<SearchListOption>([
            { name: 'Folder', value: "TYPE:'cm:folder'", checked: true },
            { name: 'Document', value: "TYPE:'cm:content'", checked: true }
        ]);

        component.reset();

        expect(component.context.update).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('');
    });

});
