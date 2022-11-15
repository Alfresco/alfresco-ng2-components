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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeCommentsComponent } from './node-comments.component';
import { ADF_COMMENTS_SERVICE, CoreModule } from '@alfresco/adf-core';
import { NodeCommentsService } from './services/node-comments.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [NodeCommentsComponent],
    exports: [NodeCommentsComponent],
    providers: [
        {
            provide: ADF_COMMENTS_SERVICE,
            useClass: NodeCommentsService
        }
    ]
})
export class NodeCommentsModule {}
