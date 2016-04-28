import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ALFRESCO_AUTHENTICATION} from 'ng2-alfresco-login/ng2-alfresco-login';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {provide} from 'angular2/core';
import {Http} from 'angular2/http';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {TRANSLATE_PROVIDERS, TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {ALFRESCO_CORE_PROVIDERS} from 'ng2-alfresco-core/services';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'node_modules/ng2-alfresco-login/i18n', '.json'),
        deps: [Http]
    }),
    // use TranslateService here, and not TRANSLATE_PROVIDERS (which will define a default TranslateStaticLoader)
    TranslateService,
    ALFRESCO_AUTHENTICATION,
    ALFRESCO_CORE_PROVIDERS
]);
