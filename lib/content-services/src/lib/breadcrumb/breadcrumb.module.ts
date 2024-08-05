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

import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { DropdownBreadcrumbComponent } from './dropdown-breadcrumb.component';

export const BREADCRUMB_DIRECTIVES = [BreadcrumbComponent, DropdownBreadcrumbComponent] as const;

/** @deprecated use `...BREADCRUMB_DIRECTIVES` instead */
@NgModule({
    imports: [...BREADCRUMB_DIRECTIVES],
    exports: [...BREADCRUMB_DIRECTIVES]
})
export class BreadcrumbModule { /* empty */ }
