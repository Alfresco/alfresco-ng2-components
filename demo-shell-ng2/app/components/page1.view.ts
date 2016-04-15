import {Component} from "angular2/core";
import {DocumentList} from "./document-list.component";
@Component({
    selector: 'page1-view',
    template: `
        <div class="container">
            <div class="row">
                <div><label><input type="checkbox" [(ngModel)]="thumbnails"> Toggle Thumbnails</label></div>
                <div><label><input type="checkbox" [(ngModel)]="breadcrumb"> Toggle Breadcrumb</label></div>
            </div>
            <div class="row">
                <alfresco-document-list #list 
                    [thumbnails]="thumbnails"
                    [breadcrumb]="breadcrumb">
                </alfresco-document-list>
            </div>
        </div>
    `,
    directives: [DocumentList]
})
export class Page1View {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
}
