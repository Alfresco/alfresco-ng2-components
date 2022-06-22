import { AlfrescoApiV2LoaderService, API_CLIENT_FACTORY_TOKEN, createAlfrescoApiV2Service, LegacyAlfrescoApiServiceFacade } from '@alfresco/adf-core/api';
import { AuthBearerInterceptor } from '@alfresco/adf-core/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AlfrescoApiV2 } from '../api/alfresco-api-v2';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { AngularClientFactory } from './angular-api-client.factory';

@NgModule({
  providers: [
    AlfrescoApiV2,
    LegacyAlfrescoApiServiceFacade,
    { provide: HTTP_INTERCEPTORS, useClass: AuthBearerInterceptor, multi: true },
    { provide: API_CLIENT_FACTORY_TOKEN, useClass: AngularClientFactory },
    {
        provide: APP_INITIALIZER,
        useFactory: createAlfrescoApiV2Service,
        deps: [
            AlfrescoApiV2LoaderService
        ],
        multi: true
    },
    {
        provide: AlfrescoApiService,
        useExisting: LegacyAlfrescoApiServiceFacade
    }
  ]
})
export class ApiClientModule {}
