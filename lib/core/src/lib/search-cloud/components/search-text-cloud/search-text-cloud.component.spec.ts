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

import { SearchTextCloudComponent } from './search-text-cloud.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { setupTestBed } from 'core';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { SearchCloudService } from '../../../services/search-cloud.service';

describe('SearchTextCloudComponent', () => {

    let fixture: ComponentFixture<SearchTextCloudComponent>;
    let service: SearchCloudService;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchTextCloudComponent);
        service = TestBed.get(SearchCloudService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should update search service value when is field is changed', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const searchInput = fixture.nativeElement.querySelector('.adf-search-text-cloud input');
            searchInput.value = 'mock-search-text';
            searchInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        });

        service.value.subscribe( value => {
            expect(value).toBe('mock-search-text');
        });
    }));

});
