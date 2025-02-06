/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPanelComponent } from './search-panel.component';
import { By } from '@angular/platform-browser';
import { ContentNodeSelectorPanelService } from '../../../content-node-selector';
import { SearchCategory } from '../../models';

describe('SearchPanelComponent', () => {
    let fixture: ComponentFixture<SearchPanelComponent>;
    let contentNodeSelectorPanelService: ContentNodeSelectorPanelService;

    const getSearchFilter = () => fixture.debugElement.query(By.css('.app-search-settings'));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchPanelComponent);
        contentNodeSelectorPanelService = TestBed.inject(ContentNodeSelectorPanelService);

        fixture.detectChanges();
    });

    it('should not render search filter when no custom models are available', () => {
        contentNodeSelectorPanelService.customModels = [];
        spyOn(contentNodeSelectorPanelService, 'convertCustomModelPropertiesToSearchCategories').and.returnValue([]);
        fixture.detectChanges();
        expect(getSearchFilter()).toBeNull();
    });

    it('should render search filter when some custom models are available', () => {
        const categoriesMock: SearchCategory[] = [
            { id: 'model1', name: 'model1', enabled: true, expanded: false, component: { selector: 'test', settings: { field: 'test' } } },
            { id: 'model2', name: 'model2', enabled: true, expanded: false, component: { selector: 'test2', settings: { field: 'test2' } } }
        ];
        contentNodeSelectorPanelService.customModels = ['model1', 'model2'];
        spyOn(contentNodeSelectorPanelService, 'convertCustomModelPropertiesToSearchCategories').and.returnValue(categoriesMock);
        fixture.detectChanges();
        expect(getSearchFilter()).toBeDefined();
    });
});
