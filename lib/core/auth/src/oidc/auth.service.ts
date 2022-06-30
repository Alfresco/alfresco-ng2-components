import { Observable } from 'rxjs';

/**
 * Provide authentication/authorization through OAuth2/OIDC protocol.
 */
export abstract class AuthService {
  /** Subscribe to whether the user has valid Id/Access tokens.  */
  abstract authenticated$: Observable<boolean>;

  /** Get whether the user has valid Id/Access tokens. */
  abstract authenticated: boolean;

  /** Subscribe to errors reaching the IdP. */
  abstract idpUnreachable$: Observable<Error>;

  /** Get user profile, if authenticated. */
  abstract getUserProfile<T>(): Promise<T>;

  /**
   * Initiate the IdP login flow.
   */
  abstract login(currentUrl?: string): Promise<void> | void;

  /**
   * Disconnect from IdP.
   *
   * @returns Promise may be returned depending on implementation
   */
  abstract logout(): Promise<void> | void;

  /**
   * Complete the login flow.
   *
   * In browsers, checks URL for auth and stored state. Call this once the application returns from IdP.
   *
   * @returns Promise, resolve with stored state, reject if unable to reach IdP
   */
  abstract loginCallback(): Promise<string | undefined>;
}
