/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { CoreModule } from 'ng2-alfresco-core';
import { EcmUserService } from './src/services/ecm-user.service';
import { BpmUserService } from './src/services/bpm-user.service';
import { UserInfoComponent } from './src/components/user-info.component';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';

export * from './src/components/user-info.component';
export * from './src/services/bpm-user.service';
export * from './src/services/ecm-user.service';

export const USER_INFO_SERVICE: any[] = [
    EcmUserService,
    BpmUserService,
    AlfrescoAuthenticationService
];

@NgModule({
    imports: [
        CoreModule
    ],
    declarations: [
        UserInfoComponent
    ],
    providers: [
        ...USER_INFO_SERVICE
    ],
    exports: [
        UserInfoComponent
    ]
})
export class UserInfoComponentModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: UserInfoComponentModule,
            providers: [
                ...USER_INFO_SERVICE
            ]
        };
    }
}
