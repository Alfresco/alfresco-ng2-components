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
import { ShareDialogComponent } from './content-node-share.dialog';
import { NodeSharedDirective } from './content-node-share.directive';

export const CONTENT_NODE_SHARE_DIRECTIVES = [ShareDialogComponent, NodeSharedDirective] as const;

/** @deprecated use `...CONTENT_NODE_SHARE_DIRECTIVES` or import each directive individually */
@NgModule({
    imports: [...CONTENT_NODE_SHARE_DIRECTIVES],
    exports: [...CONTENT_NODE_SHARE_DIRECTIVES]
})
export class ContentNodeShareModule {}
