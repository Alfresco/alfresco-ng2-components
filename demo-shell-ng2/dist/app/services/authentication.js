System.register(["angular2/core", 'rxjs/Rx'], function(exports_1, context_1) {
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
    var core_1, Rx_1;
    var Authentication;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            Authentication = (function () {
                function Authentication() {
                    this.token = localStorage.getItem('token');
                }
                Authentication.prototype.isLoggedIn = function () {
                    return !!localStorage.getItem('token');
                };
                Authentication.prototype.login = function (username, password) {
                    if (username === 'test' && password === 'test') {
                        this.token = 'token';
                        localStorage.setItem('token', this.token);
                        return Rx_1.Observable.of('token');
                    }
                    return Rx_1.Observable.throw('authentication failure');
                };
                Authentication.prototype.logout = function () {
                    this.token = undefined;
                    localStorage.removeItem('token');
                    return Rx_1.Observable.of(true);
                };
                Authentication = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Authentication);
                return Authentication;
            }());
            exports_1("Authentication", Authentication);
        }
    }
});
//# sourceMappingURL=authentication.js.map