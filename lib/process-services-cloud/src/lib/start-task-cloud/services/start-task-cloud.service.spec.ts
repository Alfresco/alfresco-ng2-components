import { TestBed } from '@angular/core/testing';

import { StartTaskCloudService } from './start-task-cloud.service';

describe('StartTaskCloudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StartTaskCloudService = TestBed.get(StartTaskCloudService);
    expect(service).toBeTruthy();
  });
});
