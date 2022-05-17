import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../testing/content.testing.module';

import { NewVersionUploaderService } from './new-version-uploader.service';

describe('NewVersionUploaderService', () => {
  let service: NewVersionUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            ContentTestingModule
        ]
    });
    service = TestBed.inject(NewVersionUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
