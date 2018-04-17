import { Component, ViewEncapsulation } from '@angular/core';
import { BlobPreviewService } from '../../services/blob-preview.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'bob-preview.component.html',
    styleUrls: [ 'bob-preview.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'blob-preview' }
})
export class BlobPreviewComponent {
    content: Blob;
    name: string;

    constructor(blobPreview: BlobPreviewService, router: Router) {
        if (blobPreview.content === null || blobPreview.name === null) {
            router.navigate([{ outlets: { overlay: null } }]);
            return;
        }

        this.content = blobPreview.content;
        this.name = blobPreview.name;
    }
}
