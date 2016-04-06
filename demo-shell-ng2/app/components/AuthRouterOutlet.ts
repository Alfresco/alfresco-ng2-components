import { ElementRef, DynamicComponentLoader, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import {Authentication} from '../services/authentication';

@Directive({selector: 'auth-router-outlet'})
export class AuthRouterOutlet extends RouterOutlet {

    publicRoutes: Array<string>;
    private router: Router;

    constructor(
        _elementRef: ElementRef, _loader: DynamicComponentLoader,
        _parentRouter: Router, @Attribute('name') nameAttr: string,
        private authentication: Authentication
    ) {
        super(_elementRef, _loader, _parentRouter, nameAttr);

        this.router = _parentRouter;
        this.publicRoutes = [
            '', 'login', 'signup'
        ];
    }

    activate(instruction: ComponentInstruction) {
        if (this._canActivate(instruction.urlPath)) {
            return super.activate(instruction);
        }

        this.router.navigate(['Login']);
    }

    _canActivate(url) {
        return this.publicRoutes.indexOf(url) !== -1
            || this.authentication.isLoggedIn();
    }
}
