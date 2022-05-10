import { AboutApi } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';

import { ApiFactoriesService } from './api-factories.service';

fdescribe('ApiFactoriesService', () => {
  let service: ApiFactoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFactoriesService);
  });

  it('should provide a get method', () => {
    const apiClient = service.get('about');

    expect(apiClient).toBeDefined();
    expect(apiClient instanceof AboutApi).toBe(true);
  });

  it('should provide a get method', () => {
    const apiClient = service.get('about');
    const apiClient2 = service.get('nodes');

  });
});
