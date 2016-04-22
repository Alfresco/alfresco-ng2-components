import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {ALFRESCO_AUTHENTICATION} from 'ng2-alfresco-login/ng2-alfresco-login';
import {ALFRESCO_PROVIDERS} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    ALFRESCO_AUTHENTICATION,
    ALFRESCO_PROVIDERS
]);
