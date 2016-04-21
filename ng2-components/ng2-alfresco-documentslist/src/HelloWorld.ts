import {Component} from 'angular2/core';

@Component({
    selector: 'hello-world',
    styles: [`
       h1 {
            color: blue;
        }
    `],
    template: `<div>
                  <h1 (click)="onClick()">{{message}}</h1>
               </div>`
})
export class HelloWorld {

    message = "Click Me ...";

    onClick() {
        this.message = "Hello World!";
        console.log(this.message);

    }

}
