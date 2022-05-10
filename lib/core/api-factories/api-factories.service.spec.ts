import { NodesApi } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { ApiFactoriesService } from './api-factories.service';


fdescribe('ApiFactoriesService', () => {
  let service: ApiFactoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFactoriesService);
  });

  it('should add api to registry', () => {
    service.register('nodes', new NodesApi());

    expect(service.get('nodes') instanceof NodesApi).toBeTruthy();
  });

  it('should throw error if we try to get unregisterd API', () => {
    expect(() => service.get('nodes')).toThrowError('Api not registred');

    service.register('nodes', new NodesApi());

    expect(() => service.get('nodes')).not.toThrowError('Api not registred');
  });

});
