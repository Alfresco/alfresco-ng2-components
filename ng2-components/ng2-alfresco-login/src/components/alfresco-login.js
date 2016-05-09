System.register(['angular2/core', 'angular2/router', 'angular2/common', '../services/alfresco-authentication', 'ng2-translate/ng2-translate'], function(exports_1, context_1) {
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
    var core_1, router_1, common_1, alfresco_authentication_1, ng2_translate_1;
    var AlfrescoLoginComponent;
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
            function (alfresco_authentication_1_1) {
                alfresco_authentication_1 = alfresco_authentication_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            }],
        execute: function() {
            AlfrescoLoginComponent = (function () {
                /**
                 * Constructor
                 * @param _fb
                 * @param auth
                 * @param router
                 */
                function AlfrescoLoginComponent(_fb, auth, router, translate) {
                    var _this = this;
                    this._fb = _fb;
                    this.auth = auth;
                    this.router = router;
                    this.method = 'POST';
                    this.onSuccess = new core_1.EventEmitter();
                    this.onError = new core_1.EventEmitter();
                    this.error = false;
                    this.success = false;
                    this.formError = {
                        'username': '',
                        'password': ''
                    };
                    this.form = this._fb.group({
                        username: ['', common_1.Validators.compose([common_1.Validators.required, common_1.Validators.minLength(4)])],
                        password: ['', common_1.Validators.required]
                    });
                    this._message = {
                        'username': {
                            'required': 'input-required-message',
                            'minlength': 'input-min-message'
                        },
                        'password': {
                            'required': 'input-required-message'
                        }
                    };
                    this.translationInit(translate);
                    this.form.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
                    this.onValueChanged();
                }
                /**
                 * Method called on submit form
                 * @param value
                 * @param event
                 */
                AlfrescoLoginComponent.prototype.onSubmit = function (value, event) {
                    var _this = this;
                    this.error = false;
                    if (event) {
                        event.preventDefault();
                    }
                    this.auth.login(this.method, value.username, value.password)
                        .subscribe(function (token) {
                        try {
                            _this.success = true;
                            _this.onSuccess.emit({
                                value: 'Login OK'
                            });
                            _this.router.navigate(['Home']);
                        }
                        catch (error) {
                            console.error(error.message);
                        }
                    }, function (err) {
                        _this.error = true;
                        _this.onError.emit({
                            value: 'Login KO'
                        });
                        console.log(err);
                        _this.success = false;
                    }, function () { return console.log('Login done'); });
                };
                /**
                 * The method check the error in the form and push the error in the formError object
                 * @param data
                 */
                AlfrescoLoginComponent.prototype.onValueChanged = function (data) {
                    for (var field in this.formError) {
                        this.formError[field] = '';
                        var hasError = this.form.controls[field].errors || (this.form.controls[field].dirty && !this.form.controls[field].valid);
                        if (hasError) {
                            for (var key in this.form.controls[field].errors) {
                                this.formError[field] += this._message[field][key] + '';
                            }
                        }
                    }
                };
                /**
                 * The method return if a field is valid or not
                 * @param field
                 * @returns {boolean}
                 */
                AlfrescoLoginComponent.prototype.isErrorStyle = function (field) {
                    if (componentHandler) {
                        componentHandler.upgradeAllRegistered();
                    }
                    if (field.valid) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                /**
                 * Initial configuration for Multi language
                 * @param translate
                 */
                AlfrescoLoginComponent.prototype.translationInit = function (translate) {
                    this.translate = translate;
                    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
                    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';
                    this.translate.setDefaultLang('en');
                    this.translate.use(userLang);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], AlfrescoLoginComponent.prototype, "method", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AlfrescoLoginComponent.prototype, "onSuccess", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], AlfrescoLoginComponent.prototype, "onError", void 0);
                AlfrescoLoginComponent = __decorate([
                    core_1.Component({
                        selector: 'alfresco-login',
                        moduleId: __moduleName,
                        directives: [router_1.ROUTER_DIRECTIVES, common_1.FORM_DIRECTIVES],
                        templateUrl: './alfresco-login.html',
                        styleUrls: ['./alfresco-login.css'],
                        pipes: [ng2_translate_1.TranslatePipe]
                    }), 
                    __metadata('design:paramtypes', [common_1.FormBuilder, alfresco_authentication_1.AlfrescoAuthenticationService, router_1.Router, ng2_translate_1.TranslateService])
                ], AlfrescoLoginComponent);
                return AlfrescoLoginComponent;
            }());
            exports_1("AlfrescoLoginComponent", AlfrescoLoginComponent);
        }
    }
});
//# sourceMappingURL=alfresco-login.js.map