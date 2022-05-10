import { TestBed } from '@angular/core/testing';

import { VersionManagerService } from './version-manager.service';

describe('VersionManagerService', () => {
  let service: VersionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
