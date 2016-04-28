System.register(['angular2/platform/browser', './app.component', 'ng2-alfresco-login/ng2-alfresco-login', 'angular2/router', 'angular2/core', 'angular2/http', 'ng2-translate/ng2-translate', 'ng2-alfresco-core/services'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, app_component_1, ng2_alfresco_login_1, router_1, core_1, http_1, http_2, ng2_translate_1, services_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (ng2_alfresco_login_1_1) {
                ng2_alfresco_login_1 = ng2_alfresco_login_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
                http_2 = http_1_1;
            },
            function (ng2_translate_1_1) {
                ng2_translate_1 = ng2_translate_1_1;
            },
            function (services_1_1) {
                services_1 = services_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                http_2.HTTP_PROVIDERS,
                core_1.provide(ng2_translate_1.TranslateLoader, {
                    useFactory: function (http) { return new ng2_translate_1.TranslateStaticLoader(http, 'node_modules/ng2-alfresco-login/i18n', '.json'); },
                    deps: [http_1.Http]
                }),
                // use TranslateService here, and not TRANSLATE_PROVIDERS (which will define a default TranslateStaticLoader)
                ng2_translate_1.TranslateService,
                ng2_alfresco_login_1.ALFRESCO_AUTHENTICATION,
                services_1.ALFRESCO_CORE_PROVIDERS
            ]);
        }
    }
});
//# sourceMappingURL=main.js.map