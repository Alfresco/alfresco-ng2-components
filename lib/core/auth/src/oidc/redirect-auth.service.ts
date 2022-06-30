import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthErrorEvent, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { AUTH_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';

const isPromise = <T>(value: T | Promise<T>): value is Promise<T> => value && typeof (value as Promise<T>).then === 'function';

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

  constructor(
    private oauthService: OAuthService,
    protected _oauthStorage: OAuthStorage,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig | Promise<AuthConfig>
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

    if (isPromise(this.authConfig)) {
        return this.authConfig.then((config) => this.configureAuth(config));
    }

    return this.configureAuth(this.authConfig);

  }

  logout() {
    this.oauthService.logOut();
  }

  async getUserProfile<T = unknown>(): Promise<T> {
    await this.ensureDiscoveryDocument();
    const userProfile = await this.oauthService.loadUserProfile();
    return (userProfile as any).info;
  }

  ensureDiscoveryDocument(): Promise<boolean> {
    this._loadDiscoveryDocumentPromise = this._loadDiscoveryDocumentPromise
      .catch(() => false)
      .then((loaded) => {
        if (!loaded) {
          return this.oauthService.loadDiscoveryDocument().then(() => true);
        }
        return true;
      });
    return this._loadDiscoveryDocumentPromise;
  }


  login(currentUrl?: string): void {
    let stateKey: string | undefined;

    if (currentUrl) {
      stateKey = `auth_state_${Math.random()}${Date.now()}`;
      this._oauthStorage.setItem(stateKey, JSON.stringify(currentUrl || {}));
    }

    // initLoginFlow will initialize the login flow in either code or implicit depending on the configuration
    this.ensureDiscoveryDocument().then(() => void this.oauthService.initLoginFlow(stateKey));
  }

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

  private configureAuth(config: AuthConfig) {
    this.oauthService.configure(config);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    if (config.sessionChecksEnabled) {
      this.oauthService.events.pipe(filter((event) => event.type === 'session_terminated')).subscribe(() => {
        this.oauthService.logOut();
      });
    }

    return this.ensureDiscoveryDocument().then(() =>
      void this.oauthService.setupAutomaticSilentRefresh()
    );
  }
}
