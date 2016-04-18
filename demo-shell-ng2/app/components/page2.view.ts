import {Component} from "angular2/core";
import {HelloWorld} from 'ng2-alfresco/components';

@Component({
    selector: 'page2-view',
    template: `
        <div class="container">
            <div class="row">
                <h2>Page 2</h2>
                <hello-world></hello-world>
            </div>
        </div>
    `,
    directives: [HelloWorld]
})
export class Page2View {

}
