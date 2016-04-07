import {Component} from "angular2/core";

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <ng-content></ng-content>
            </div>
        </nav>
    `,
    styles: [
        `
        :host .image-button {
            padding-bottom: 10px;
            padding-top: 12px;
            max-height: 50px;
        }
        `
    ]
})
export class AppNavBar {

}
