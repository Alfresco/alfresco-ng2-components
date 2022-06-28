import { TestBed } from '@angular/core/testing';

import { AuthConfigService } from './auth-config.service';

describe('AuthConfigService', () => {
  let service: AuthConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
