import { Injectable } from '@angular/core';
import { Constructor } from '../interface';
import { AlfrescoApiService } from '../services';
import { ApiClientFactory } from './api-client.factory';

@Injectable()
export class LegacyClientFactory implements ApiClientFactory {
    constructor(private alfrescoApiService: AlfrescoApiService) {}

    create<T>(apiClass: Constructor<T>): T {
        return new apiClass(this.alfrescoApiService.getInstance());
    }
}


