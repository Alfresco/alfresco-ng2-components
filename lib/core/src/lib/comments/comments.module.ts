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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataColumnModule } from '../data-column/data-column.module';
import { DataTableModule } from '../datatable/datatable.module';
import { PipeModule } from '../pipes/pipe.module';

import { CommentListComponent } from './comment-list.component';
import { CommentsComponent } from './comments.component';

@NgModule({
    imports: [
        PipeModule,
        DataColumnModule,
        DataTableModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule,
        TranslateModule
    ],
    declarations: [
        CommentListComponent,
        CommentsComponent
    ],
    exports: [
        CommentListComponent,
        CommentsComponent
    ]
})
export class CommentsModule {
}
