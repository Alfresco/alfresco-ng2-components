import { Injectable } from '@angular/core';
import { AuthConfig, OAuthErrorEvent, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { AppConfigService, AppConfigValues } from '../../../app-config/app-config.service';
import { OauthConfigModel } from '../../../models/oauth-config.model';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectAuthService extends AuthService {
  private _loadDiscoveryDocumentPromise = Promise.resolve(false);

  /** Subscribe to whether the user has valid Id/Access tokens.  */
  authenticated$!: Observable<boolean>;

  /** Subscribe to errors reaching the IdP. */
  idpUnreachable$!: Observable<Error>;

  /** Get whether the user has valid Id/Access tokens. */
  get authenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  /** Get current Id token, if authenticated. */
  get idToken(): string | undefined {
    return this.oauthService.getIdToken();
  }

  /** Get current Access token, if authenticated. */
  get accessToken(): string | undefined {
    return this.oauthService.getAccessToken();
  }

  constructor(
    private oauthService: OAuthService, 
    protected _oauthStorage: OAuthStorage, 
    private storageService: StorageService, 
    private appConfigService: AppConfigService
  ) {
    super();
  }

  init() {
    this.oauthService.clearHashAfterLogin = true;

    this.authenticated$ = this.oauthService.events.pipe(
      startWith(undefined),
      map(() => this.authenticated),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.idpUnreachable$ = this.oauthService.events.pipe(
      filter((event): event is OAuthErrorEvent => event.type === 'discovery_document_load_error'),
      map((event) => event.reason as Error)
    );

    this.configureAuth();
  }

  logout() {
    this.oauthService.logOut();
  }

  /** Get user profile, if authenticated. */
  async getUserProfile<T = unknown>(): Promise<T> {
    await this.ensureDiscoveryDocument();
    const userProfile = await this.oauthService.loadUserProfile();
    return (userProfile as any).info;
  }

  /**
   * Ensure that the discovery document is loaded, if not already.
   * This can safely be repeated as a pre-auth check.
   *
   * @returns Promise, resolve if loaded, reject if unable to reach IdP
   */
  ensureDiscoveryDocument(): Promise<boolean> {
    this._loadDiscoveryDocumentPromise = this._loadDiscoveryDocumentPromise
      .catch(() => false)
      .then((loaded) => {
        if (!loaded) {
          return this.oauthService.loadDiscoveryDocument().then(() => true);
        }

        const redirect = this._getRiderectUrl();
        console.log(`%c DEBUG:LOG redirect ${redirect}`, 'color: green');

        return true;
      });
    return this._loadDiscoveryDocumentPromise;
  }

  /**
   * Initiate the login flow.
   */
  login(currentUrl: string): void {
    let stateKey: string | undefined;

    if (currentUrl) {
      stateKey = `auth_state_${Math.random()}${Date.now()}`;
      this._oauthStorage.setItem(stateKey, JSON.stringify(currentUrl || {}));
    }

    // initLoginFlow will initialize the login flow in either code or implicit depending on the configuration
    this.ensureDiscoveryDocument().then(() => void this.oauthService.initLoginFlow(stateKey));
  }

  /**
   * Complete the login flow.
   * Checks URL for auth and stored state. Call this once the application returns from IdP.
   */
  async loginCallback(): Promise<string | undefined> {
    return this.ensureDiscoveryDocument()
      .then(() => this.oauthService.tryLogin({ preventClearHashAfterLogin: false }))
      .then(() => this._getRiderectUrl());
  }

  private _getRiderectUrl() {
    const DEFAULT_REDIRECT = '/';
    const stateKey = this.oauthService.state;

    if (stateKey) {
      const stateStringified = this._oauthStorage.getItem(stateKey);
      if (stateStringified) {
        // cleanup state from storage
        this._oauthStorage.removeItem(stateKey);
        return JSON.parse(stateStringified);
      }
    }

    return DEFAULT_REDIRECT;
  }

  private getAuthConfig(codeFlow = false): AuthConfig {
    const oauth2: OauthConfigModel = Object.assign({}, this.appConfigService.get<OauthConfigModel>(AppConfigValues.OAUTHCONFIG, null));

    return {
      issuer: oauth2.host,
      loginUrl: `${oauth2.host}/protocol/openid-connect/auth`,
      silentRefreshRedirectUri: oauth2.redirectSilentIframeUri,
      redirectUri: window.location.origin + oauth2.redirectUri,
      postLogoutRedirectUri: window.location.origin + oauth2.redirectUriLogout,
      clientId: oauth2.clientId,
      scope: oauth2.scope,
      ...(codeFlow ? { responseType: 'code' } : {})
    };
  }

  private configureAuth() {
    const config = this.getAuthConfig();

    this.oauthService.configure(config);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.setStorage(this.storageService);


    if (config.sessionChecksEnabled) {
      this.oauthService.events.pipe(filter((event) => event.type === 'session_terminated')).subscribe(() => {
        this.oauthService.logOut();
      });
    }

    return this.ensureDiscoveryDocument().then(() =>
      // this._router.navigate([redirect]);

      void this.oauthService.setupAutomaticSilentRefresh()
    );
  }
}
