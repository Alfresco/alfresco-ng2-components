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

export { FacetFieldBucket } from './facet-field-bucket.interface';
export { FacetField } from './facet-field.interface';
export { FacetQuery } from './facet-query.interface';
export { FilterQuery } from './filter-query.interface';
export { SearchCategory } from './search-category.interface';
export { SearchWidgetSettings } from './search-widget-settings.interface';
export { SearchWidget } from './search-widget.interface';
export { SearchConfiguration } from './search-configuration.interface';
export { SearchQueryBuilderService } from './search-query-builder.service';
export { SearchRange } from './search-range.interface';

export * from './components/search.component';
export * from './components/search-control.component';
export * from './components/empty-search-result.component';
export * from './components/search-filter/search-filter.component';
export * from './components/search-filter/search-filter.service';
export * from './components/search-chip-list/search-chip-list.component';
export * from './components/search-sorting-picker/search-sorting-picker.component';

export * from './search.module';
