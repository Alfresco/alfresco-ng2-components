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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { MaterialModule } from '../material.module';
import { ShareDialogComponent } from './content-node-share.dialog';
import { NodeSharedDirective } from './content-node-share.directive';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        ShareDialogComponent,
        NodeSharedDirective
    ],
    exports: [
        ShareDialogComponent,
        NodeSharedDirective
    ],
    entryComponents: [
        ShareDialogComponent
    ]
})
export class ContentNodeShareModule {
    static forRoot(): ModuleWithProviders<ContentNodeShareModule> {
        return {
            ngModule: ContentNodeShareModule
        };
    }

    static forChild(): ModuleWithProviders<ContentNodeShareModule> {
        return {
            ngModule: ContentNodeShareModule
        };
    }
}
