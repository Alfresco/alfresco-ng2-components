import { API_CLIENT_FACTORY_TOKEN, LegacyAlfrescoApiServiceFacade, AlfrescoApiV2 } from '@alfresco/adf-core/api';
import { AuthBearerInterceptor } from '@alfresco/adf-core/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { AlfrescoApiV2LoaderService, createAlfrescoApiV2Service } from './alfresco-api-v2-loader.service';
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
