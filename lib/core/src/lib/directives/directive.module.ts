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
import { HighlightDirective } from './highlight.directive';
import { InfiniteSelectScrollDirective } from './infinite-select-scroll.directive';
import { LogoutDirective } from './logout.directive';
import { TooltipCardComponent } from './tooltip-card/tooltip-card.component';
import { TooltipCardDirective } from './tooltip-card/tooltip-card.directive';
import { UploadDirective } from './upload.directive';

export const CORE_DIRECTIVES = [
    HighlightDirective,
    LogoutDirective,
    UploadDirective,
    TooltipCardDirective,
    TooltipCardComponent,
    InfiniteSelectScrollDirective
];

/** @deprecated use `...CORE_DIRECTIVES` or import standalone directives directly  */
@NgModule({
    imports: [...CORE_DIRECTIVES],
    exports: [...CORE_DIRECTIVES]
})
export class DirectiveModule {}
