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

import { SearchNumberRangeComponent } from './search-number-range.component';

/* tslint:disable */
fdescribe('SearchNumberRangeComponent', () => {

    let component: SearchNumberRangeComponent;

    beforeEach(() => {
        component = new SearchNumberRangeComponent();
    });

    it('should setup form elements on init', () => {
        component.ngOnInit();
        expect(component.form).toBeDefined();
        expect(component.to).toBeDefined();
        expect(component.form).toBeDefined();
    });

    it('should reset form', () => {
        component.ngOnInit();
        component.form.reset({ from: '10', to: '20' });
        component.reset();

        expect(component.from.value).toEqual('');
        expect(component.to.value).toEqual('');
        expect(component.form.value).toEqual({ from: '', to: '' });
    });

    it('should update query builder on reset', () => {
        const context: any = {
            queryFragments: {
                contentSize: 'query'
            },
            update() {}
        };

        component.id = 'contentSize';
        component.context = context;

        spyOn(context, 'update').and.stub();

        component.ngOnInit();
        component.reset();

        expect(context.queryFragments.contentSize).toEqual('');
        expect(context.update).toHaveBeenCalled();
    });

    it('should update query builder on value changes', () => {
        const context: any = {
            queryFragments: {},
            update() {}
        };

        component.id = 'contentSize';
        component.context = context;
        component.settings = { field: 'cm:content.size' };

        spyOn(context, 'update').and.stub();

        component.ngOnInit();
        component.apply({
            from: '10',
            to: '20'
        }, true)

        const expectedQuery = 'cm:content.size:[10 TO 20]';
        expect(context.queryFragments[component.id]).toEqual(expectedQuery);
        expect(context.update).toHaveBeenCalled();
    });

});
