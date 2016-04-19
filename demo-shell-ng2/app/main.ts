import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {Authentication} from './services/authentication';
import {ALFRESCO_PROVIDERS} from 'ng2-alfresco/components';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    Authentication,
    ALFRESCO_PROVIDERS
]);
