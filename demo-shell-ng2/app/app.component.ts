import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Login} from './components/login/login';
import {Authentication} from './services/authentication';
import {AuthRouterOutlet} from './components/AuthRouterOutlet';
import {HomeView} from './components/home.view';
import {Page1View} from './components/page1.view';
import {AlfrescoService} from 'ng2-alfresco-documentslist/dist/alfresco.service';
import {Page2View} from './components/page2.view';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet]
})
@RouteConfig([
    {path: '/', name: 'Home', component: HomeView, useAsDefault: true},
    {path: '/login', name: 'Login', component: Login},
    {path: '/page1', name: 'Page1', component: Page1View},
    {path: '/page2', name: 'Page2', component: Page2View}
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
}
