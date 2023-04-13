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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterMenuCardComponent } from './search-filter-menu-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../../testing/content.testing.module';
import { setupTestBed } from '@alfresco/adf-core';

describe('SearchFilterMenuComponent', () => {
    let component: SearchFilterMenuCardComponent;
    let fixture: ComponentFixture<SearchFilterMenuCardComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFilterMenuCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit on close click', () => {
        const spyCloseEvent = spyOn(component.close, 'emit');
        const closeButton = fixture.debugElement.nativeElement.querySelector('.adf-search-filter-title-action');

        closeButton.click();
        expect(spyCloseEvent).toHaveBeenCalled();
    });
});
