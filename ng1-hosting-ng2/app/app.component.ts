import {Component} from 'angular2/core';
import {Tabs, Tab} from "./components/ng2/tabs";

@Component({
    selector: 'my-app',
    template: `
        <h2>Angular 2 components</h2>
        <tabs>
            <tab tabTitle="Foo">
                <file-upload accept="{{accept}}"  droppable="{{droppable}}" target="{{target}}" multi="false"  >Choose File</file-upload>
            </tab>
            <tab tabTitle="Bar">
                Content of tab Bar
            </tab>
        </tabs>
    `,
    directives: [Tabs, Tab]
})
export class AppComponent {
    target: string = 'http://192.168.99.100:8080/alfresco/service/api/upload';
    multi: string = 'true';
    accept: string ='image/*';
    droppable: boolean = false;
}
