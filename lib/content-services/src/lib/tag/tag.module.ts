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
import { TagActionsComponent } from './tag-actions.component';
import { TagListComponent } from './tag-list.component';
import { TagNodeListComponent } from './tag-node-list.component';
import { TagsCreatorComponent } from './tags-creator/tags-creator.component';

export const CONTENT_TAG_DIRECTIVES = [TagsCreatorComponent, TagActionsComponent, TagListComponent, TagNodeListComponent] as const;

/** @deprecated use `...CONTENT_TAG_DIRECTIVES` instead or import standalone components directly */
@NgModule({
    imports: [...CONTENT_TAG_DIRECTIVES],
    exports: [...CONTENT_TAG_DIRECTIVES]
})
export class TagModule {}
