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

import { NgModule } from '@angular/core';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel/content-node-selector-panel.component';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { NameLocationCellComponent } from './name-location-cell/name-location-cell.component';
import { DropdownSitesComponent } from './site-dropdown/sites-dropdown.component';

export const CONTENT_NODE_SELECTOR_DIRECTIVES = [
    ContentNodeSelectorPanelComponent,
    NameLocationCellComponent,
    ContentNodeSelectorComponent,
    DropdownSitesComponent
];

/** @deprecated use `...CONTENT_NODE_SELECTOR_DIRECTIVES` or import the individual components */
@NgModule({
    imports: [...CONTENT_NODE_SELECTOR_DIRECTIVES],
    exports: [...CONTENT_NODE_SELECTOR_DIRECTIVES]
})
export class ContentNodeSelectorModule {}
