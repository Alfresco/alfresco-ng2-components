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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P

import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AlfrescoApiV2 } from './services/alfresco-api-v2';
import { AlfrescoApiClientFactory } from './services/alfresco-api-client.factory';
import { AlfrescoApiV2LoaderService, createAlfrescoApiV2Service } from './services/alfresco-api-v2-loader.service';
import { AuthBearerInterceptor } from './services/auth-bearer.interceptor';
import { LegacyAlfrescoApiServiceFacade } from './services/legacy-alfresco-api-service.facade';
import { AlfrescoApiService } from '../services/alfresco-api.service';

@NgModule({
    imports: [
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'CSRF-TOKEN',
            headerName: 'X-CSRF-TOKEN'
        })
    ],
    providers: [
        AlfrescoApiV2,
        AlfrescoApiV2LoaderService,
        LegacyAlfrescoApiServiceFacade,
        AlfrescoApiClientFactory,
        {
            provide: APP_INITIALIZER,
            useFactory: createAlfrescoApiV2Service,
            deps: [
                AlfrescoApiV2LoaderService
            ],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS, useClass:
            AuthBearerInterceptor, multi: true
        },
        // Reproviding legacy like service for older code
        {
            provide: AlfrescoApiService,
            useExisting: LegacyAlfrescoApiServiceFacade
        }
    ]
})
export class AlfrescoApiModule {}
