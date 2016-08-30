/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ContextMenuService } from './context-menu.service';
import { ContextMenuHolderComponent } from './context-menu-holder.component';
import { ContextMenuDirective } from './context-menu.directive';

export * from './context-menu.service';
export * from './context-menu-holder.component';
export * from './context-menu.directive';

export const CONTEXT_MENU_PROVIDERS: [any] = [
    ContextMenuService
];

export const CONTEXT_MENU_DIRECTIVES: [any] = [
    ContextMenuHolderComponent,
    ContextMenuDirective
];
