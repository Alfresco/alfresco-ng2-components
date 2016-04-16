import {Component} from "angular2/core";
import {DocumentList} from "./document-list.component";
@Component({
    selector: 'page1-view',
    template: `
        <div class="container">
            <div class="row">
                <div><label><input type="checkbox" [(ngModel)]="thumbnails"> Thumbnails</label></div>
                <div><label><input type="checkbox" [(ngModel)]="breadcrumb"> Breadcrumb</label></div>
                <div><label><input type="checkbox" [(ngModel)]="navigation"> Navigation</label></div>
                <div><label><input type="checkbox" [(ngModel)]="downloads"> Downloads</label></div>
            </div>
            <div class="row">
                <alfresco-document-list #list 
                    [thumbnails]="thumbnails"
                    [breadcrumb]="breadcrumb"
                    [navigate]="navigation"
                    [downloads]="downloads">
                </alfresco-document-list>
            </div>
        </div>
    `,
    directives: [DocumentList]
})
export class Page1View {
    thumbnails: boolean = true;
    breadcrumb: boolean = false;
    navigation: boolean = true;
    downloads: boolean = true;
}
