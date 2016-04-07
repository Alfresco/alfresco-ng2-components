import {Component} from 'angular2/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/template/single.component.html'
})

export class SingleComponent {
    target: string = 'http://192.168.99.100:8080/alfresco/service/api/upload';
    multi: string = 'true';
    accept: string ='image/*';
    droppable: boolean = false;

}
