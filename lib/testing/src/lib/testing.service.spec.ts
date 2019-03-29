import { TestBed } from '@angular/core/testing';

import { TestingService } from './testing.service';

describe('TestingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestingService = TestBed.get(TestingService);
    expect(service).toBeTruthy();
  });
});
