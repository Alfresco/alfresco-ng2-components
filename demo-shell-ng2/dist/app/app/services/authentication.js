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
    var Authentication;
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
            Authentication = (function () {
                function Authentication(http) {
                    this.http = http;
                    this._host = 'http://192.168.99.100:8080';
                    this._baseUrl = this._host + '/alfresco/service/api/';
                    this.token = localStorage.getItem('token');
                }
                Authentication.prototype.isLoggedIn = function () {
                    return !!localStorage.getItem('token');
                };
                Authentication.prototype.login = function (method, username, password) {
                    if (method === 'GET') {
                        return this.loginGet(username, password);
                    }
                    else {
                        return this.loginPost(username, password);
                    }
                };
                Authentication.prototype.loginGet = function (username, password) {
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
                Authentication.prototype.loginPost = function (username, password) {
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
                Authentication.prototype.saveJwt = function (jwt) {
                    if (jwt) {
                        localStorage.setItem('token', jwt);
                    }
                };
                Authentication.prototype.logout = function () {
                    this.token = undefined;
                    localStorage.removeItem('token');
                    return Rx_1.Observable.of(true);
                };
                Authentication.prototype.handleError = function (error) {
                    // in a real world app, we may send the error to some remote logging infrastructure
                    // instead of just logging it to the console
                    console.error(error);
                    return Rx_1.Observable.throw(error.json().error || 'Server error');
                };
                Authentication = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], Authentication);
                return Authentication;
            }());
            exports_1("Authentication", Authentication);
        }
    }
});

//# sourceMappingURL=authentication.js.map
