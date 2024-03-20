import { TestBed } from '@angular/core/testing';
import { OidcAuthenticationService } from './oidc-authentication.service';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AppConfigService, AuthService } from '@alfresco/adf-core';
import { AUTH_MODULE_CONFIG } from '../oidc/auth-config';

class MockAppConfigService {
    config = {
        oauth2: {
            logoutParameters: ["client_id", "returnTo", "response_type"]
        }
    };

    setConfig(newConfig: any) {
        this.config.oauth2 = newConfig;
    }

    get(key: any, defaultValue?: any) {
        if (key === 'oauth2') {
            return this.config.oauth2;
        }
        return defaultValue;
    }
}


class MockOAuthService {
    clientId = 'testClientId';
    redirectUri = 'testRedirectUri';
    logOut = jasmine.createSpy();
}

fdescribe('OidcAuthenticationService', () => {
    let service: OidcAuthenticationService;
    let oauthService: OAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                OidcAuthenticationService,
                { provide: AppConfigService, useClass: MockAppConfigService },
                { provide: OAuthService, useClass: MockOAuthService },
                { provide: OAuthStorage, useValue: {} },
                { provide: AUTH_MODULE_CONFIG, useValue: {} },
                { provide: AuthService, useValue: {} },
            ]
        });
        service = TestBed.inject(OidcAuthenticationService);
        oauthService = TestBed.inject(OAuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('logout', () => {
        let mockAppConfigService: MockAppConfigService;

        beforeEach(() => {
            mockAppConfigService = TestBed.inject(AppConfigService) as any;
        });

        it('should handle logout with default parameters', () => {
            service.logout();
            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId',
                returnTo: 'testRedirectUri',
                response_type: 'code'
            });
        });

        it('should handle logout with additional parameter redirect_uri', () => {
            mockAppConfigService.setConfig({
                logoutParameters: ["client_id", "returnTo", "redirect_uri", "response_type"]
            });


            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId',
                returnTo: 'testRedirectUri',
                redirect_uri: 'testRedirectUri',
                response_type: 'code'
            });
        });

        it('should handle logout with an empty configuration object', () => {
            mockAppConfigService.setConfig({ logoutParameters: [] });

            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({});
        });

        it('should ignore undefined parameters', () => {
            mockAppConfigService.setConfig({
                logoutParameters: ["client_id", "unknown_param"]
            });
            service.logout();

            expect(oauthService.logOut).toHaveBeenCalledWith({
                client_id: 'testClientId'
            });
        });
    });
});
