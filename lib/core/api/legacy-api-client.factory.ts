import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { ApiClientFactory } from './api-client.factory';
import { Constructor } from './types';

@Injectable()
export class LegacyClientFactory implements ApiClientFactory {
    constructor(private alfrescoApiService: AlfrescoApiService) { }

    create<T>(apiClass: Constructor<T>): T {
        return new apiClass(this.alfrescoApiService.getInstance());
    }
}
