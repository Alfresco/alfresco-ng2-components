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

import { AboutApi, NodesApi } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { Constructor } from '../interface';
import { ApiClientFactory } from './api-client.factory';
import { ApiClientsService } from './api-clients.service';

class MockApiClientFactory extends ApiClientFactory {
  create<T>(apiClass: Constructor<T>): T {
    return new apiClass();
  }
}

describe('ApiService', () => {
    let apiService: ApiClientsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            { provide: ApiClientFactory, useClass: MockApiClientFactory }
          ]
        });
        apiService = TestBed.inject(ApiClientsService);
    });

    it('should add api to registry', () => {
        apiService.register('ContentClient.nodes', NodesApi);

        expect(apiService.get('ContentClient.nodes') instanceof NodesApi).toBeTruthy();
    });

    it('should throw error if we try to get unregisterd API', () => {
        expect(() => apiService.get('ContentClient.nodes')).toThrowError();

        apiService.register('ContentClient.nodes', NodesApi);

        expect(() => apiService.get('ContentClient.nodes')).not.toThrowError();
    });

    it('should work even with Api enum', () => {
      apiService.register('ActivitiClient.about', AboutApi);

      expect(apiService.get('ActivitiClient.about') instanceof AboutApi).toBeTruthy();
    });

    it('should create only single instance of API', () => {
      apiService.register('ActivitiClient.about', AboutApi);

      const a = apiService.get('ActivitiClient.about');
      const b = apiService.get('ActivitiClient.about');

      expect(a).toBe(b);
    });

});
