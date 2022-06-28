import { ApiClientFactory, Constructor, AlfrescoApiV2 } from '@alfresco/adf-core/api';
import { Injectable } from '@angular/core';

@Injectable()
export class AngularClientFactory implements ApiClientFactory {
    constructor(private alfrescoApiService: AlfrescoApiV2) { }

    create<T>(apiClass: Constructor<T>): T {
        return new apiClass(this.alfrescoApiService);
    }
}
