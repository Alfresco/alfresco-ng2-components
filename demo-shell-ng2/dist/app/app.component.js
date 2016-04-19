System.register(['angular2/core', './services/form-service', "angular2/router", "./components/login", "./services/authentication", "./components/AuthRouterOutlet", "./components/core/SideMenu", "./components/core/navbar.component", "./components/form-design-toolbar.component", "./components/forms.view", "./components/page1.view", "./components/page2.view"], function(exports_1, context_1) {
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
    var core_1, form_service_1, router_1, login_1, authentication_1, AuthRouterOutlet_1, SideMenu_1, navbar_component_1, form_design_toolbar_component_1, forms_view_1, page1_view_1, page2_view_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (form_service_1_1) {
                form_service_1 = form_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (authentication_1_1) {
                authentication_1 = authentication_1_1;
            },
            function (AuthRouterOutlet_1_1) {
                AuthRouterOutlet_1 = AuthRouterOutlet_1_1;
            },
            function (SideMenu_1_1) {
                SideMenu_1 = SideMenu_1_1;
            },
            function (navbar_component_1_1) {
                navbar_component_1 = navbar_component_1_1;
            },
            function (form_design_toolbar_component_1_1) {
                form_design_toolbar_component_1 = form_design_toolbar_component_1_1;
            },
            function (forms_view_1_1) {
                forms_view_1 = forms_view_1_1;
            },
            function (page1_view_1_1) {
                page1_view_1 = page1_view_1_1;
            },
            function (page2_view_1_1) {
                page2_view_1 = page2_view_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(auth, router) {
                    this.auth = auth;
                    this.router = router;
                    this.target = 'http://192.168.99.100:8080/alfresco/service/api/upload';
                    this.multi = 'true';
                    this.accept = 'image/*';
                    this.droppable = false;
                }
                AppComponent.prototype.toggleMenu = function (menu, $event) {
                    if (menu) {
                        menu.toggle();
                    }
                    if ($event) {
                        $event.preventDefault();
                    }
                };
                AppComponent.prototype.isActive = function (instruction) {
                    return this.router.isRouteActive(this.router.generate(instruction));
                };
                AppComponent.prototype.isLoggedIn = function () {
                    return this.auth.isLoggedIn();
                };
                AppComponent.prototype.onLogout = function (event) {
                    var _this = this;
                    event.preventDefault();
                    this.auth.logout()
                        .subscribe(function () { return _this.router.navigate(['Login']); });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES, AuthRouterOutlet_1.AuthRouterOutlet, SideMenu_1.SideMenu, navbar_component_1.AppNavBar, form_design_toolbar_component_1.FormDesignToolbar],
                        providers: [form_service_1.FormService]
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Home', component: page2_view_1.Page2View, useAsDefault: true },
                        { path: '/login', name: 'Login', component: login_1.Login },
                        { path: '/forms', name: 'Forms', component: forms_view_1.FormsView },
                        { path: '/page1', name: 'Page1', component: page1_view_1.Page1View },
                        { path: '/page2', name: 'Page2', component: page2_view_1.Page2View }
                    ]), 
                    __metadata('design:paramtypes', [authentication_1.Authentication, router_1.Router])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map