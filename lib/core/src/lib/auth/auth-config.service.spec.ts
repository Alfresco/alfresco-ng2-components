import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AUTH_MODULE_CONFIG } from './auth-config';

import { AuthConfigService } from './auth-config.service';

describe('AuthConfigService', () => {
    let service: AuthConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AUTH_MODULE_CONFIG, useValue: { useHash: true } }
            ]
        });
        service = TestBed.inject(AuthConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
