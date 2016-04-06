import {Component} from "angular2/core";

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <ng-content></ng-content>
            </div>
        </nav>
    `
})
export class AppNavBar {

}
