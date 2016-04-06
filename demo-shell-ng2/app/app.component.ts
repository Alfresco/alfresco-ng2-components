import {Component} from 'angular2/core';
import {FormService} from './services/form-service';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {Login} from "./components/login";
import {Authentication} from "./services/authentication";
import {AuthRouterOutlet} from "./components/AuthRouterOutlet";
import {SideMenu} from "./components/core/SideMenu";
import {AppNavBar} from "./components/core/navbar.component";
import {FormDesignToolbar} from "./components/form-design-toolbar.component";
import {HomeView} from "./components/home.view";
import {FormsView} from "./components/forms.view";
import {Page1View} from "./components/page1.view";
import {Page2View} from "./components/page2.view";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, AuthRouterOutlet, SideMenu, AppNavBar, FormDesignToolbar],
    providers: [FormService]
})
@RouteConfig([
    {path: '/', name: 'Home', component: HomeView, useAsDefault: true},
    {path: '/login', name: 'Login', component: Login},
    {path: '/forms', name: 'Forms', component: FormsView},
    {path: '/page1', name: 'Page1', component: Page1View},
    {path: '/page2', name: 'Page2', component: Page2View}
])
export class AppComponent {

    constructor(
        public auth: Authentication,
        public router: Router
    ){}

    toggleMenu(menu: SideMenu, $event) {
        if (menu) {
            menu.toggle();
        }
        if ($event) {
            $event.preventDefault();
        }
    }

    isActive(instruction: any[]): boolean {
        return this.router.isRouteActive(this.router.generate(instruction));
    }

    isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    onLogout(event) {
        event.preventDefault();
        this.auth.logout()
            .subscribe(
                () => this.router.navigate(['Login'])
            );
    }

    /*
    hideMenu(menu: SideMenu) {
        if (menu && menu.isOpen) {
            menu.close();
        }
    }
    */
}
