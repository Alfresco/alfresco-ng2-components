import {Component} from "angular2/core";
@Component({
    selector: 'page2-view',
    template: `
        <div class="container">
            <div class="row">
                <h1>Page 2</h1>
                <input [(ngModel)]="username">
                <span>Username: {{username}}</span>
                <hello-world [who]="username"></hello-world>
            </div>
        </div>
    `
})
export class Page2View {
    username: string = 'Unicorn';
}
