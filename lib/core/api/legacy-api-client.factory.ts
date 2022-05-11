import { Injectable } from '@angular/core';
import { Constructor } from 'core/interface';
import { AlfrescoApiService } from '../services';
import { ApiClientFactory } from './api-client.factory';


@Injectable()
export class LegacyClientFactory extends ApiClientFactory {
  constructor(private alfrescoApiService: AlfrescoApiService) {
    super();
  }

  create<T>(apiClass: Constructor<T>): T {
    return new apiClass(this.alfrescoApiService.getInstance());
  }
}


