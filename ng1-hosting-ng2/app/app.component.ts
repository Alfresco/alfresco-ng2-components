import {Component} from 'angular2/core';
import {Tabs, Tab} from "./components/ng2/tabs";

@Component({
    selector: 'my-app',
    template: `
        <h2>Angular 2 components</h2>
        <tabs>
            <tab tabTitle="Foo">
                Content of tab Foo
            </tab>
            <tab tabTitle="Bar">
                Content of tab Bar
            </tab>
        </tabs>
    `,
    directives: [Tabs, Tab]
})
export class AppComponent { }
