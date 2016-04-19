import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, URLSearchParams, Response} from 'angular2/http';

declare var xml2json:any;

@Injectable()
export class Authentication {
    token:string;

    private _host:string = 'http://192.168.99.100:8080';
    private _baseUrl:string = this._host + '/alfresco/service/api/';

    constructor(public http:Http) {
        this.token = localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    login(method:string, username:string, password:string) {
        if (method === 'GET') {
            return this.loginGet(username, password);
        } else {
            return this.loginPost(username, password);
        }
    }

    loginGet(username:string, password:string) {
        const searchParams = new URLSearchParams();
        searchParams.set('u', username);
        searchParams.set('pw', password);

        return this.http.get(this._baseUrl + 'login', {search: searchParams})
            .map((res:any) => {
                let data = JSON.parse(xml2json(res.text(), '  '));
                this.token = data.ticket;
                this.saveJwt(this.token);
            })
            .catch(this.handleError);
    }

    loginPost(username:string, password:string) {
        let credentials = '{ username: ' + username + ', password: ' + password + ' }';

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'login', credentials, {
                headers: headers
            })
            .map((res:any) => {
                let response = res.json();
                this.token = response.data.ticket;
                this.saveJwt(this.token);
            })
            .catch(this.handleError);
    }

    saveJwt(jwt) {
        if (jwt) {
            localStorage.setItem('token', jwt);
        }
    }

    logout() {
        this.token = undefined;
        localStorage.removeItem('token');

        return Observable.of(true);
    }

    private handleError(error:Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
