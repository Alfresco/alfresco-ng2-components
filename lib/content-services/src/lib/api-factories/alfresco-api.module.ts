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

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AlfrescoApiNoAuthService } from './alfresco-api-no-auth.service';
import { AlfrescoApiLoaderService, createAlfrescoApiInstance } from '../api-factories/alfresco-api-v2-loader.service';
import { AlfrescoApiService } from '../services';

@NgModule({
    providers :[
        { provide: AlfrescoApiService, useClass: AlfrescoApiNoAuthService },
        {
            provide: APP_INITIALIZER,
            useFactory: createAlfrescoApiInstance,
            deps: [ AlfrescoApiLoaderService ],
            multi: true
        }
    ]
})
export class AlfrescoApiModule { }
