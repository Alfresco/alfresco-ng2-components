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

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@alfresco/adf-core';
import { MaterialModule } from '../material.module';
import { GroupCloudComponent } from './components/group-cloud.component';
import { InitialGroupNamePipe } from './pipe/group-initial.pipe';
import { IDENTITY_GROUP_SERVICE_TOKEN } from './services/identity-group-service.token';
import { IdentityGroupService } from './services/identity-group.service';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [GroupCloudComponent, InitialGroupNamePipe],
    providers: [
        { provide: IDENTITY_GROUP_SERVICE_TOKEN, useExisting: IdentityGroupService }
    ],
    exports: [GroupCloudComponent, InitialGroupNamePipe]
})
export class GroupCloudModule { }
