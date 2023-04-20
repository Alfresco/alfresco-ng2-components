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
import { PeopleCloudComponent } from './components/people-cloud.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { CoreModule } from '@alfresco/adf-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentityUserService } from './services/identity-user.service';
import { IDENTITY_USER_SERVICE_TOKEN } from './services/identity-user-service.token';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [PeopleCloudComponent],
    exports: [
        PeopleCloudComponent
    ],
    providers: [
        { provide: IDENTITY_USER_SERVICE_TOKEN, useExisting: IdentityUserService }
    ]
})
export class PeopleCloudModule {
}
