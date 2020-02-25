/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed } from "@alfresco/adf-core";
import { ContentTestingModule } from "../../../testing/content.testing.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe('SearchTextComponent', () => {
    let fixture: ComponentFixture<SearchTextComponent>;
    let component: SearchTextComponent;

    setupTestBed({
        imports: [ ContentTestingModule ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchTextComponent);
        component = fixture.componentInstance;
        component.id = 'text';
        component.settings = {
            'pattern': "cm:name:'(.*?)'",
            'field': 'cm:name',
            'placeholder': 'Enter the name'
        };

        component.context = <any> {
            queryFragments: {},
            update() {}
        };
    });

    it('should parse value from the context at startup', () => {
        component.context.queryFragments[component.id] = "cm:name:'secret.pdf'";
        fixture.detectChanges();

        expect(component.value).toEqual('secret.pdf');
    });

    it('should not parse value when pattern not defined', () => {
        component.settings.pattern = null;
        component.context.queryFragments[component.id] = "cm:name:'secret.pdf'";
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
        expect(component.context.queryFragments[component.id]).toBe("cm:name:'top-secret.doc'");
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should reset query builder', () => {
        component.onChangedHandler({
            target: {
                value: 'top-secret.doc'
            }
        });

        expect(component.value).toBe('top-secret.doc');
        expect(component.context.queryFragments[component.id]).toBe("cm:name:'top-secret.doc'");

        component.onChangedHandler({
            target: {
                value: ''
            }
        });

        expect(component.value).toBe('');
        expect(component.context.queryFragments[component.id]).toBe('');
    });

    it('should show the custom name', () => {
        component.context.queryFragments[component.id] = "cm:name:'secret.pdf'";
        fixture.detectChanges();

        expect(component.value).toEqual('secret.pdf');
    });

});
