import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Component({
    selector: 'app-shared-link-view',
    templateUrl: 'shared-link-view.component.html',
    styleUrls: [ 'shared-link-view.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { 'class': 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit {

    mimeType = null;
    fileName = null;
    fileUrl = null;

    constructor(
        private route: ActivatedRoute,
        private apiService: AlfrescoApiService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const linkId = params.id;

            if (linkId) {
                this.apiService.sharedLinksApi.getSharedLink(linkId).then(details => {
                    this.mimeType = details.entry.content.mimeType;
                    this.fileName = details.entry.name;
                    this.fileUrl = this.apiService.contentApi.getSharedLinkContentUrl(linkId);
                });
            }
        });
    }

}
