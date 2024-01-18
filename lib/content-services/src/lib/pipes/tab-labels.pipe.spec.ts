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

import { TabLabelsPipe } from './tab-labels.pipe';
import {
  mockSearchFilterWithoutDisplayedLabelsByField,
  mockSearchFilterWithWrongDisplayedLabelsByField,
  mockSearchFilterWithDisplayedLabelsByField
} from '../mock/date-range-search-filter.mock';

describe('TabLabelsPipe', () => {
  const pipe = new TabLabelsPipe();

  it('should default to field name when there are no settings available', () => {
    expect(pipe.transform('test', null)).toBe('test');
  });

  it('should default to field name when settings do not contain "displayedLabelsByField" property', () => {
    expect(pipe.transform('test', mockSearchFilterWithoutDisplayedLabelsByField.component.settings)).toBe('test');
  });

  it('should default to field name when settings with "displayedLabelsByField" property are available but do not contain field', () => {
    expect(pipe.transform('test', mockSearchFilterWithWrongDisplayedLabelsByField.component.settings)).toBe('test');
  });

  it('should display correct label when settings with "displayedLabelsByField" property are available and do contain field', () => {
    expect(pipe.transform('test', mockSearchFilterWithDisplayedLabelsByField.component.settings)).toBe('test-tab-label');
  });
});
