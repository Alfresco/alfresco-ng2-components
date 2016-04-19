System.register(['angular2/core', 'angular2/router', '../services/authentication'], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, authentication_1;
    var AuthRouterOutlet;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (authentication_1_1) {
                authentication_1 = authentication_1_1;
            }],
        execute: function() {
            let AuthRouterOutlet = class AuthRouterOutlet extends router_1.RouterOutlet {
                constructor(_elementRef, _loader, _parentRouter, nameAttr, authentication) {
                    super(_elementRef, _loader, _parentRouter, nameAttr);
                    this.authentication = authentication;
                    this.router = _parentRouter;
                    this.publicRoutes = [
                        '', 'login', 'signup'
                    ];
                }
                activate(instruction) {
                    if (this._canActivate(instruction.urlPath)) {
                        return super.activate(instruction);
                    }
                    this.router.navigate(['Login']);
                }
                _canActivate(url) {
                    return this.publicRoutes.indexOf(url) !== -1
                        || this.authentication.isLoggedIn();
                }
            };
            AuthRouterOutlet = __decorate([
                core_1.Directive({ selector: 'auth-router-outlet' }),
                __param(3, core_1.Attribute('name')),
                __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, router_1.Router, String, authentication_1.Authentication])
            ], AuthRouterOutlet);
            exports_1("AuthRouterOutlet", AuthRouterOutlet);
        }
    }
});

//# sourceMappingURL=AuthRouterOutlet.js.map
