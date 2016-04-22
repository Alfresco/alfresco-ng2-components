import { Observable } from 'rxjs/Rx';
import { Http } from 'angular2/http';
export declare class Authentication {
    http: Http;
    token: string;
    private _host;
    private _baseUrl;
    constructor(http: Http);
    isLoggedIn(): boolean;
    login(method: string, username: string, password: string): Observable<void>;
    loginGet(username: string, password: string): Observable<void>;
    loginPost(username: string, password: string): Observable<void>;
    saveJwt(jwt: any): void;
    logout(): Observable<boolean>;
    private handleError(error);
}
