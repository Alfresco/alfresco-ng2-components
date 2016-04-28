import { Observable } from 'rxjs/Rx';
import { Http } from 'angular2/http';
import { AlfrescoSettingsService } from '../../ng2-alfresco-core/services';
/**
 * The AlfrescoAuthenticationService provide the login service and store the token in the localStorage
 */
export declare class AlfrescoAuthenticationService {
    http: Http;
    private settings;
    token: string;
    private _host;
    private _baseUrl;
    /**
     * Constructor
     * @param http
     */
    constructor(http: Http, settings: AlfrescoSettingsService);
    /**
     * The method return tru if the user is logged in
     * @returns {boolean}
     */
    isLoggedIn(): boolean;
    /**
     * Method to delegate GET or POST login
     * @param method
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    login(method: string, username: string, password: string): Observable<void>;
    /**
     * The method provide the login with GET Request
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    loginGet(username: string, password: string): Observable<void>;
    /**
     * The method provide the login with POST Request
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    loginPost(username: string, password: string): Observable<void>;
    /**
     * The method save the toke in the localStorage
     * @param jwt
     */
    saveJwt(jwt: any): void;
    /**
     * The method remove the token from the local storage
     * @returns {Observable<T>}
     */
    logout(): Observable<boolean>;
    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error);
}
