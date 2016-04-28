import { Router } from 'angular2/router';
import { AlfrescoSettingsService } from 'ng2-alfresco-core/services';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-login/ng2-alfresco-login';
export declare class AppComponent {
    auth: AlfrescoAuthenticationService;
    router: Router;
    constructor(auth: AlfrescoAuthenticationService, router: Router, alfrescoSettingsService: AlfrescoSettingsService);
}
