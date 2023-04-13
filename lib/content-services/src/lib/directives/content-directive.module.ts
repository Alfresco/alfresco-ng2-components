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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

import { NodeLockDirective } from './node-lock.directive';
import { NodeCounterComponent, NodeCounterDirective } from './node-counter.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { CheckAllowableOperationDirective } from './check-allowable-operation.directive';
import { LibraryFavoriteDirective } from './library-favorite.directive';
import { LibraryMembershipDirective } from './library-membership.directive';
import { NodeDeleteDirective } from './node-delete.directive';
import { NodeFavoriteDirective } from './node-favorite.directive';
import { NodeRestoreDirective } from './node-restore.directive';
import { NodeDownloadDirective } from './node-download.directive';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule
    ],
    declarations: [
        NodeLockDirective,
        NodeCounterDirective,
        NodeCounterComponent,
        AutoFocusDirective,
        CheckAllowableOperationDirective,
        LibraryFavoriteDirective,
        LibraryMembershipDirective,
        NodeDeleteDirective,
        NodeFavoriteDirective,
        NodeRestoreDirective,
        NodeDownloadDirective
    ],
    exports: [
        NodeLockDirective,
        NodeCounterDirective,
        AutoFocusDirective,
        CheckAllowableOperationDirective,
        LibraryFavoriteDirective,
        LibraryMembershipDirective,
        NodeDeleteDirective,
        NodeFavoriteDirective,
        NodeRestoreDirective,
        NodeDownloadDirective
    ]
})
export class ContentDirectiveModule {
}
