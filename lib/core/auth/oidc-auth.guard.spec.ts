import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { AuthService } from './auth.service';
import { OidcAuthGuard } from './oidc-auth.guard';

describe('OidcAuthGuard', () => {
  let guard: OidcAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(AuthService)]
    });
    guard = TestBed.inject(OidcAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
