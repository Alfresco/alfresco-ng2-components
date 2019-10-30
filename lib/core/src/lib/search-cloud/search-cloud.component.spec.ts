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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { SearchCloudComponent } from './search-cloud.component';
import { SearchCloudTypesEnum } from '../models/search-cloud.model';

describe('SearchCloudComponent', () => {

    let fixture: ComponentFixture<SearchCloudComponent>;
    let component: SearchCloudComponent;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchCloudComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit search text when is field is changed', async(() => {
        spyOn(component.change, 'emit');
        component.type = SearchCloudTypesEnum.text;
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const searchInput = fixture.nativeElement.querySelector('.adf-search-text-cloud input');
            searchInput.value = 'mock-search-text';
            searchInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        });

        component.change.subscribe( emitValue => {
            expect(emitValue).toBe('mock-search-text');
        });
    }));

});
