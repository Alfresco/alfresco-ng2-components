import {Component} from "angular2/core";
@Component({
    selector: 'page2-view',
    template: `
        <div class="container">
            <div class="row">
                <input [(ngModel)]="username">
                <span>Username: {{username}}</span>
                <hello-world [text]="username">
                    <button>{{'interpolation: ' + username}}</button>
                </hello-world>
                <hello-world text="test user"></hello-world>
            </div>
            <div class="row">
                <p>
                    List below is a web component bound to array of items coming from angular.<br>
                    Add/remove buttons control angular array and web component reacts on changes.
                </p>
                <simple-list [items]="items"></simple-list>
                <button (click)="addItem()">add item</button>
                <button (click)="removeItem()">remove item</button>
            </div>
        </div>
    `
})
export class Page2View {
    username: string = 'Unicorn';
    items = ['one', 'two', 'three'];

    addItem() {
        this.items.push('test');
    }

    removeItem() {
        this.items.pop();
    }
}
