import {Component} from 'angular2/core';
import {AlfrescoLoginComponent} from 'ng2-alfresco-login/ng2-alfresco-login';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AlfrescoSettingsService} from 'ng2-alfresco-core/services';
import {AlfrescoAuthenticationService} from 'ng2-alfresco-login/ng2-alfresco-login';


@Component({
    selector: 'my-app',
    template: '<alfresco-login></alfresco-login>',
    directives: [ROUTER_DIRECTIVES, AlfrescoLoginComponent]
})

@RouteConfig([
    {path: '/', name: 'Login', component: AlfrescoLoginComponent, useAsDefault: true}
])
export class AppComponent {

    constructor(public auth:AlfrescoAuthenticationService,
                public router:Router,
                alfrescoSettingsService:AlfrescoSettingsService) {
        alfrescoSettingsService.host = 'http://192.168.99.100:8080';

    }

}