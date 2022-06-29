import { AboutApi, DiscoveryApi } from '@alfresco/js-api';
import { NgModule } from '@angular/core';
import { ApiFactoryService } from '../api-factories/api-factory.service';
import { Constructor } from './types';

export const factoryFor = <T>(apiClass: Constructor<T>) => (service: ApiFactoryService) => service.get(apiClass);
export const providerFor = <T>(apiClass: Constructor<T>) => ({ provide: apiClass, useFactory: factoryFor(apiClass), deps: [ApiFactoryService]});

@NgModule({
    providers: [
        providerFor(DiscoveryApi),
        providerFor(AboutApi)
    ]
})
export class AlfrescoApiModule {}
