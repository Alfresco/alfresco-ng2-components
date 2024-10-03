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

import { SearchSliderComponent } from './search-slider.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';

describe('SearchSliderComponent', () => {
    let fixture: ComponentFixture<SearchSliderComponent>;
    let component: SearchSliderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchSliderComponent);
        component = fixture.componentInstance;
        component.id = 'slider';
        component.context = {
            queryFragments: {
                slider: ''
            },
            filterRawParams: {},
            populateFilters: new ReplaySubject(1),
            update: jasmine.createSpy('update')
        } as any;
        component.settings = {
            field: 'field1',
            min: 10,
            max: 100,
            step: 2,
            thumbLabel: true
        };
    });

    it('should setup slider from settings', () => {
        fixture.detectChanges();

        expect(component.min).toEqual(10);
        expect(component.max).toEqual(100);
        expect(component.step).toEqual(2);
        expect(component.thumbLabel).toEqual(true);
    });

    it('should update its query part on slider change', () => {
        component.settings['field'] = 'cm:content.size';
        component.value = 10;
        fixture.detectChanges();

        component.onChangedHandler();
        expect(component.context.queryFragments[component.id]).toEqual('cm:content.size:[0 TO 10]');
        expect(component.context.filterRawParams[component.id]).toEqual(10);
        expect(component.context.update).toHaveBeenCalled();

        component.value = 20;
        component.onChangedHandler();
        expect(component.context.queryFragments[component.id]).toEqual('cm:content.size:[0 TO 20]');
        expect(component.context.filterRawParams[component.id]).toEqual(20);
    });

    it('should reset the value for query builder', () => {
        component.value = 20;
        fixture.detectChanges();

        component.reset();

        expect(component.value).toBe(10);
        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.filterRawParams[component.id]).toBe(null);
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should reset to 0 if min not provided', () => {
        component.settings.min = null;
        component.value = 20;
        fixture.detectChanges();

        component.reset();

        expect(component.value).toBe(0);
        expect(component.context.queryFragments['slider']).toBe('');
        expect(component.context.update).toHaveBeenCalled();
    });

    it('should populate filter state when populate filters event has been observed', async () => {
        component.context.filterLoaded = new ReplaySubject(1);
        spyOn(component.context.filterLoaded, 'next').and.stub();
        spyOn(component.displayValue$, 'next').and.stub();
        fixture.detectChanges();
        component.context.populateFilters.next({ slider: 20 });
        fixture.detectChanges();

        expect(component.displayValue$.next).toHaveBeenCalledWith('20 ');
        expect(component.value).toBe(20);
        expect(component.context.filterRawParams[component.id]).toBe(20);
        expect(component.context.filterLoaded.next).toHaveBeenCalled();
    });
});
