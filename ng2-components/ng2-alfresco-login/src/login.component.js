System.register(['angular2/core', 'angular2/router', 'angular2/common', './authentication.service'], function(exports_1, context_1) {
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
    var core_1, router_1, common_1, authentication_service_1;
    var Login;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (authentication_service_1_1) {
                authentication_service_1 = authentication_service_1_1;
            }],
        execute: function() {
            Login = (function () {
                /**
                 * Constructor
                 * @param fb
                 * @param auth
                 * @param router
                 */
                function Login(fb, auth, router) {
                    this.auth = auth;
                    this.router = router;
                    this.method = 'GET';
                    this.error = false;
                    this.form = fb.group({
                        username: ['', common_1.Validators.compose([common_1.Validators.required, common_1.Validators.minLength(4)])],
                        password: ['', common_1.Validators.required]
                    });
                }
                /**
                 * Method called on submit form
                 * @param value
                 * @param event
                 */
                Login.prototype.onSubmit = function (value, event) {
                    var _this = this;
                    if (event) {
                        event.preventDefault();
                    }
                    this.auth.login(this.method, value.username, value.password)
                        .subscribe(function (token) { return _this.router.navigate(['Home']); }, function () {
                        _this.error = true;
                    });
                };
                /**
                 * The method return if a field is valid or not
                 * @param field
                 * @returns {boolean}
                 */
                Login.prototype.isErrorStyle = function (field) {
                    componentHandler.upgradeAllRegistered();
                    if (field.valid) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Login.prototype, "method", void 0);
                Login = __decorate([
                    core_1.Component({
                        selector: 'alfresco-login',
                        moduleId: __moduleName,
                        directives: [router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES],
                        templateUrl: './login.component.html',
                        styleUrls: ['./login.component.css'],
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, authentication_service_1.Authentication, router_1.Router])
                ], Login);
                return Login;
            }());
            exports_1("Login", Login);
        }
    }
});
//# sourceMappingURL=login.component.js.map