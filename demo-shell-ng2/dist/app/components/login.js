System.register(["angular2/core", "angular2/router", "angular2/common", "../services/authentication"], function(exports_1, context_1) {
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
    var core_1, router_1, common_1, authentication_1;
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
            function (authentication_1_1) {
                authentication_1 = authentication_1_1;
            }],
        execute: function() {
            Login = (function () {
                function Login(fb, auth, router) {
                    this.auth = auth;
                    this.router = router;
                    this.error = false;
                    this.form = fb.group({
                        username: ['', common_1.Validators.required],
                        password: ['', common_1.Validators.required]
                    });
                }
                Login.prototype.onSubmit = function (value, event) {
                    var _this = this;
                    //event.preventDefault();
                    this.auth.login(value.username, value.password)
                        .subscribe(
                    //(token: any) => this.router.navigate(['../Home']),
                    function (token) { return _this.router.navigate(['Home']); }, function () { _this.error = true; });
                };
                Login = __decorate([
                    core_1.Component({
                        selector: 'login',
                        directives: [router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES],
                        template: "\n        <div class=\"row\">\n            <div class=\"col-md-4 col-md-offset-4\">\n                <form [ngFormModel]=\"form\" (submit)=\"onSubmit(form.value, $event)\">\n                    <div *ngIf=\"error\">Check your password</div>\n                    <div class=\"form-group\">\n                        <label for=\"username\">Username</label>\n                        <input class=\"form-control\" type=\"text\" ngControl=\"username\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"password\">Password</label>\n                        <input class=\"form-control\" type=\"password\" ngControl=\"password\">\n                    </div>\n                    <button type=\"submit\" class=\"btn btn-default\" [disabled]=\"!form.valid\">Login</button>\n                </form>\n            </div>\n        </div>\n    "
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, authentication_1.Authentication, router_1.Router])
                ], Login);
                return Login;
            }());
            exports_1("Login", Login);
        }
    }
});
//# sourceMappingURL=login.js.map