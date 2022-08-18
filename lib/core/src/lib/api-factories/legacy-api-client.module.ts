import { NgModule } from '@angular/core';
import { API_CLIENT_FACTORY_TOKEN } from '@alfresco/adf-core/api';
import { LegacyClientFactory } from './legacy-api-client.factory';


@NgModule({
    providers: [
        { provide: API_CLIENT_FACTORY_TOKEN, useClass: LegacyClientFactory }
    ]
})
export class LegacyApiClientModule { }
