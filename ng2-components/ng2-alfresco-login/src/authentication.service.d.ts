import { Http } from 'angular2/http';
export declare class Authentication {
    http: Http;
    token: string;
    private _host;
    private _baseUrl;
    /**
     * Constructor
     * @param http
     */
    constructor(http: Http);
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
    login(method: string, username: string, password: string): any;
    /**
     * The method provide the login with GET Request
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    loginGet(username: string, password: string): any;
    /**
     * The method provide the login with POST Request
     * @param username
     * @param password
     * @returns {Observable<R>|Observable<T>}
     */
    loginPost(username: string, password: string): any;
    /**
     * The method save the toke in the localStorage
     * @param jwt
     */
    saveJwt(jwt: any): void;
    /**
     * The method remove the token from the local storage
     * @returns {Observable<T>}
     */
    logout(): any;
    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error);
}
