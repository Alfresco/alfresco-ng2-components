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

import { ContentNodeSelectorPanelService } from './content-node-selector-panel.service';
import { mockContentModelDateProperty, mockContentModelTextProperty, mockConvertedSearchCategoriesFromModels } from '../mock/content-model.mock';

describe('ContentNodeSelectorPanelService', () => {

    const contentNodeSelectorPanelService = new ContentNodeSelectorPanelService();

    it('should support text type', () => {
        expect(contentNodeSelectorPanelService.modelPropertyTypeToSearchFilterTypeMap.get('d:text')).toEqual('text');
        expect(contentNodeSelectorPanelService.isTypeSupported('d:text')).toEqual(true);
    });

    it('should support date type', () => {
        expect(contentNodeSelectorPanelService.modelPropertyTypeToSearchFilterTypeMap.get('d:date')).toEqual('date-range');
        expect(contentNodeSelectorPanelService.isTypeSupported('d:date')).toEqual(true);
    });

    it('should return false for an unsupported type', () => {
        expect(contentNodeSelectorPanelService.isTypeSupported('d:unsupported')).toEqual(false);
    });

    it('should modelPropertyTypeToSearchFilterTypeMap contain only the supported types', () => {
        const expectedSupportedTypesMap = new Map<string, string> ();
        expectedSupportedTypesMap.set('d:text', 'text');
        expectedSupportedTypesMap.set('d:date', 'date-range');
        expectedSupportedTypesMap.set('d:datetime', 'datetime-range');

        expect(contentNodeSelectorPanelService.modelPropertyTypeToSearchFilterTypeMap).toEqual(expectedSupportedTypesMap);
    });

    it('should search config contain the correct filters converted from the custom content model properties', () => {
        contentNodeSelectorPanelService.customModels = [mockContentModelTextProperty, mockContentModelDateProperty];
        const expectedConvertedPropertiesToSearchCategories = contentNodeSelectorPanelService.convertCustomModelPropertiesToSearchCategories();

        expect(expectedConvertedPropertiesToSearchCategories).toEqual(mockConvertedSearchCategoriesFromModels);
    });
});
