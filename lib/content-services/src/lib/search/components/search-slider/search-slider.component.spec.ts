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

import { MatSliderChange } from '@angular/material/slider';
import { SearchSliderComponent } from './search-slider.component';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchSliderComponent', () => {
    let fixture: ComponentFixture<SearchSliderComponent>;
    let component: SearchSliderComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchSliderComponent);
        component = fixture.componentInstance;
    });

    it('should setup slider from settings', () => {
        const settings: any = {
            min: 10,
            max: 100,
            step: 2,
            thumbLabel: true
        };

        component.settings = settings;
        fixture.detectChanges();

        expect(component.min).toEqual(settings.min);
        expect(component.max).toEqual(settings.max);
        expect(component.step).toEqual(settings.step);
        expect(component.thumbLabel).toEqual(settings.thumbLabel);
    });

    it('should update value on slider change', () => {
        component.onChangedHandler({ value: 10 } as MatSliderChange);
        expect(component.value).toEqual(10);

        component.onChangedHandler({ value: 20 } as MatSliderChange);
        expect(component.value).toEqual(20);
    });

    it('should update its query part on slider change', () => {
        const context: any = {
            queryFragments: {},
            update: () => {}
        };

        spyOn(context, 'update').and.stub();

        component.context = context;
        component.id = 'contentSize';
        component.settings = { field: 'cm:content.size' };
        fixture.detectChanges();

        component.onChangedHandler({ value: 10 } as MatSliderChange);
        expect(context.queryFragments[component.id]).toEqual('cm:content.size:[0 TO 10]');
        expect(context.update).toHaveBeenCalled();

        component.onChangedHandler({ value: 20 } as MatSliderChange);
        expect(context.queryFragments[component.id]).toEqual('cm:content.size:[0 TO 20]');
    });

    it('should reset the value for query builder', () => {
        const settings: any = {
            field: 'field1',
            min: 10,
            max: 100,
            step: 2,
            thumbLabel: true
        };

        const context: any = {
            queryFragments: {},
            update: () => {}
        };

        component.settings = settings;
        component.context = context;
        component.value = 20;
        component.id = 'slider';
        spyOn(context, 'update').and.stub();
        fixture.detectChanges();

        component.reset();

        expect(component.value).toBe(settings.min);
        expect(context.queryFragments[component.id]).toBe('');
        expect(context.update).toHaveBeenCalled();
    });

    it('should reset to 0 if min not provided', () => {
        const settings: any = {
            field: 'field1',
            min: null,
            max: 100,
            step: 2,
            thumbLabel: true
        };

        const context: any = {
            queryFragments: {},
            update: () => {}
        };

        component.settings = settings;
        component.context = context;
        component.value = 20;
        component.id = 'slider';
        spyOn(context, 'update').and.stub();
        fixture.detectChanges();

        component.reset();

        expect(component.value).toBe(0);
        expect(context.queryFragments['slider']).toBe('');
        expect(context.update).toHaveBeenCalled();
    });
});
