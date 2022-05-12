import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../testing/content.testing.module';

import { VersionManagerService } from './version-manager.service';

describe('VersionManagerService', () => {
  let service: VersionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            ContentTestingModule
        ]
    });
    service = TestBed.inject(VersionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
