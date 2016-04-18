import {Component} from 'angular2/core';
import {DocumentList} from 'ng2-alfresco/components';

@Component({
    selector: 'home-view',
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2">
                    <ul class="list-unstyled">
                        <li><label><input type="checkbox" [(ngModel)]="thumbnails"> Thumbnails</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="breadcrumb"> Breadcrumb</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="navigation"> Navigation</label></li>
                        <li><label><input type="checkbox" [(ngModel)]="downloads"> Downloads</label></li>
                    </ul>
                    <hr>
                    <ul class="list-unstyled" style="font-size: 10px">
                        <li *ngFor="#event of events">
                            <strong>{{event.name}}</strong>: {{event.value.displayName}}
                        </li>
                    </ul>
                </div>
                <div class="col-md-10">
                    <alfresco-document-list #list 
                        [thumbnails]="thumbnails"
                        [breadcrumb]="breadcrumb"
                        [navigate]="navigation"
                        [downloads]="downloads"
                        (itemClick)="onItemClick($event)">
                    </alfresco-document-list>
                </div>
            </div>
        </div>
    `,
    directives: [DocumentList]
})
export class HomeView {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
    navigation: boolean = true;
    downloads: boolean = true;

    events: any[] = [];

    onItemClick($event) {
        console.log($event.value);
        this.events.push({
            name: 'Item Clicked',
            value: $event.value
        });
    }
}
