System.register(['angular2/core', 'rxjs/Rx', 'angular2/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Rx_1, http_1;
    var AlfrescoAuthenticationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            /**
             * The AlfrescoAuthenticationService provide the login service and store the token in the localStorage
             */
            AlfrescoAuthenticationService = (function () {
                /**
                 * Constructor
                 * @param http
                 */
                function AlfrescoAuthenticationService(http) {
                    this.http = http;
                    this._host = 'http://192.168.99.100:8080';
                    this._baseUrl = this._host + '/alfresco/service/api/';
                    this.token = localStorage.getItem('token');
                }
                /**
                 * The method return tru if the user is logged in
                 * @returns {boolean}
                 */
                AlfrescoAuthenticationService.prototype.isLoggedIn = function () {
                    return !!localStorage.getItem('token');
                };
                /**
                 * Method to delegate GET or POST login
                 * @param method
                 * @param username
                 * @param password
                 * @returns {Observable<R>|Observable<T>}
                 */
                AlfrescoAuthenticationService.prototype.login = function (method, username, password) {
                    if (method === 'GET') {
                        return this.loginGet(username, password);
                    }
                    else {
                        return this.loginPost(username, password);
                    }
                };
                /**
                 * The method provide the login with GET Request
                 * @param username
                 * @param password
                 * @returns {Observable<R>|Observable<T>}
                 */
                AlfrescoAuthenticationService.prototype.loginGet = function (username, password) {
                    var _this = this;
                    var searchParams = new http_1.URLSearchParams();
                    searchParams.set('u', username);
                    searchParams.set('pw', password);
                    return this.http.get(this._baseUrl + 'login', { search: searchParams })
                        .map(function (res) {
                        var data = JSON.parse(xml2json(res.text(), '  '));
                        _this.token = data.ticket;
                        _this.saveJwt(_this.token);
                    })
                        .catch(this.handleError);
                };
                /**
                 * The method provide the login with POST Request
                 * @param username
                 * @param password
                 * @returns {Observable<R>|Observable<T>}
                 */
                AlfrescoAuthenticationService.prototype.loginPost = function (username, password) {
                    var _this = this;
                    var credentials = '{ username: ' + username + ', password: ' + password + ' }';
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post(this._baseUrl + 'login', credentials, {
                        headers: headers
                    })
                        .map(function (res) {
                        var response = res.json();
                        _this.token = response.data.ticket;
                        _this.saveJwt(_this.token);
                    })
                        .catch(this.handleError);
                };
                /**
                 * The method save the toke in the localStorage
                 * @param jwt
                 */
                AlfrescoAuthenticationService.prototype.saveJwt = function (jwt) {
                    if (jwt) {
                        localStorage.setItem('token', jwt);
                    }
                };
                /**
                 * The method remove the token from the local storage
                 * @returns {Observable<T>}
                 */
                AlfrescoAuthenticationService.prototype.logout = function () {
                    this.token = undefined;
                    localStorage.removeItem('token');
                    return Rx_1.Observable.of(true);
                };
                /**
                 * The method write the error in the console browser
                 * @param error
                 * @returns {ErrorObservable}
                 */
                AlfrescoAuthenticationService.prototype.handleError = function (error) {
                    console.error(error);
                    return Rx_1.Observable.throw(error.json().error || 'Server error');
                };
                AlfrescoAuthenticationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], AlfrescoAuthenticationService);
                return AlfrescoAuthenticationService;
            }());
            exports_1("AlfrescoAuthenticationService", AlfrescoAuthenticationService);
        }
    }
});
//# sourceMappingURL=alfresco-authentication.service.js.map