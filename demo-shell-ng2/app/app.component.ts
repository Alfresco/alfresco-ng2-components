import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Authentication} from 'ng2-alfresco-login/ng2-alfresco-login';
import {AlfrescoService} from 'ng2-alfresco-documentlist/ng2-alfresco-documentlist';
import {MDL} from './components/common/MaterialDesignLiteUpgradeElement';
import {FilesComponent} from './components/files/files.component';
import {Login} from 'ng2-alfresco-login/ng2-alfresco-login';
import {AuthRouterOutlet} from './components/router/AuthRouterOutlet';

declare var document: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet, MDL]
})
@RouteConfig([
    {path: '/home', name: 'Home', component: FilesComponent},
    {path: '/', name: 'Files', component: FilesComponent, useAsDefault: true},
    {path: '/login', name: 'Login', component: Login}
])
export class AppComponent {

    constructor(public auth:Authentication,
                public router:Router,
                alfrescoService:AlfrescoService) {
        alfrescoService.host = 'http://192.168.99.100:8080';
    }

    isActive(instruction:any[]):boolean {
        return this.router.isRouteActive(this.router.generate(instruction));
    }

    isLoggedIn():boolean {
        return this.auth.isLoggedIn();
    }

    onLogout(event) {
        event.preventDefault();
        this.auth.logout()
            .subscribe(
                () => this.router.navigate(['Login'])
            );
    }

    hideDrawer() {
        // todo: workaround for drawer closing
        document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
    }
}
