import {Component} from "angular2/core";
import {DocumentList} from "./document-list.component";
@Component({
    selector: 'page1-view',
    template: `
        <div class="container">
            <div class="row">
                <label>
                    <input type="checkbox" [(ngModel)]="thumbnails"> Toggle Thumbnails
                </label>
            </div>
            <div class="row">
                <alfresco-document-list #list [thumbnails]="thumbnails"></alfresco-document-list>
            </div>
        </div>
    `,
    directives: [DocumentList]
})
export class Page1View {
    thumbnails: boolean = true;
}
